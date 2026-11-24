import { getSupabaseClient } from './client.ts';
import { learningStorageKey } from '../learning-storage';
import type { LessonProgressStatus } from '../../types/database.types.ts';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'pending' | 'error';
export const LEARNING_UPDATED_EVENT = 'affinity-learning-updated';
export const LOCAL_PROGRESS_STORAGE_KEY = 'affinity_academy_progress_v2';

export interface LocalLessonProgress {
  lessonId: string;
  status: LessonProgressStatus;
  lastSlideIndex: number;
  quizScore?: number | null;
  completedAt?: string | null;
  clientUpdatedAt: string;
}

interface QueueItem {
  token: string;
  progress: LocalLessonProgress;
  attempts: number;
  retryAt: number;
}

type ProgressMap = Record<string, LocalLessonProgress>;
type Queue = Record<string, QueueItem>;
const SYNC_QUEUE_STORAGE_KEY = 'affinity_academy_sync_queue_v2';
const LEGACY_QUEUE_KEY = 'affinity_academy_sync_queue';
const listeners = new Set<(value: SyncStatus) => void>();
const inFlight = new Map<string, Promise<boolean>>();
let syncStatus: SyncStatus = 'offline';
let lastSyncAt: number | null = null;
let activeUserId: string | undefined;
let retryTimer: ReturnType<typeof setTimeout> | undefined;

function setStatus(value: SyncStatus) {
  syncStatus = value;
  listeners.forEach(listener => listener(value));
}

export function subscribeSyncStatus(listener: (value: SyncStatus) => void): () => void {
  listeners.add(listener);
  listener(syncStatus);
  return () => { listeners.delete(listener); };
}

export const getSyncStatus = () => syncStatus;
export const getLastSyncAt = () => lastSyncAt;

function readObject<T>(key: string): Record<string, T> {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) ?? '{}');
    return data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, T> : {};
  } catch {
    return {};
  }
}

export function getAllLocalProgress(owner?: string): ProgressMap {
  return readObject(learningStorageKey(LOCAL_PROGRESS_STORAGE_KEY, owner));
}

export const getLocalProgress = (lessonId: string) => getAllLocalProgress()[lessonId] ?? null;

const queueKey = (owner: string) => learningStorageKey(SYNC_QUEUE_STORAGE_KEY, owner);

async function withQueueLock<T>(owner: string, action: () => T): Promise<T> {
  if (navigator.locks) return navigator.locks.request(queueKey(owner), action);
  return action();
}

export function clearProgressQueue(owner: string | undefined) {
  if (owner) {
    localStorage.removeItem(queueKey(owner));
    localStorage.setItem(learningStorageKey(LEGACY_QUEUE_KEY, owner), 'migrated');
  }
}

export async function saveLessonProgress(
  userId: string | null, progress: Omit<LocalLessonProgress, 'clientUpdatedAt'>,
): Promise<void> {
  try {
    const key = learningStorageKey(LOCAL_PROGRESS_STORAGE_KEY, userId ?? undefined);
    const write = () => {
      const current = readObject<LocalLessonProgress>(key);
      const prior = current[progress.lessonId];
      const next: LocalLessonProgress = {
        ...progress,
        clientUpdatedAt: new Date(Math.max(Date.now(), (Date.parse(prior?.clientUpdatedAt ?? '') || 0) + 1)).toISOString(),
      };
      localStorage.setItem(key, JSON.stringify({ ...current, [next.lessonId]: next }));
      if (userId) {
        const queue = readObject<QueueItem>(queueKey(userId));
        queue[next.lessonId] = { token: crypto.randomUUID(), progress: next, attempts: 0, retryAt: 0 };
        localStorage.setItem(queueKey(userId), JSON.stringify(queue));
      }
    };
    if (userId && getSupabaseClient()) {
      await withQueueLock(userId, write);
      if (userId === activeUserId) {
        setStatus(navigator.onLine ? 'pending' : 'offline');
        schedule(userId);
      }
    } else {
      write();
      setStatus('offline');
    }
  } catch (error) {
    setStatus('error');
    throw error;
  }
}

function schedule(owner: string) {
  if (owner !== activeUserId) return;
  clearTimeout(retryTimer);
  if (!navigator.onLine) return;
  const queue = Object.values(readObject<QueueItem>(queueKey(owner)));
  if (queue.length) {
    retryTimer = setTimeout(() => { void flushSyncQueue(owner); },
      Math.max(500, Math.min(...queue.map(item => item.retryAt)) - Date.now()));
  }
}

function migrateLegacyQueue(owner: string): void {
  const queue = readObject<QueueItem>(queueKey(owner));
  if (localStorage.getItem(learningStorageKey(LEGACY_QUEUE_KEY, owner))) return;
  const legacy = localStorage.getItem(LEGACY_QUEUE_KEY);
  if (!legacy) return;
  let entries: { userId: string; payload: LocalLessonProgress }[];
  try {
    const parsed: unknown = JSON.parse(legacy);
    if (!Array.isArray(parsed)) return;
    entries = parsed;
  } catch { return; }
  const owned = entries.filter(item => item?.userId === owner && item.payload?.lessonId);
  for (const { payload } of owned) {
    const current = queue[payload.lessonId];
    if (current && current.progress.clientUpdatedAt >= payload.clientUpdatedAt) continue;
    queue[payload.lessonId] = { token: crypto.randomUUID(), progress: payload, attempts: 0, retryAt: 0 };
  }
  if (owned.length) {
    localStorage.setItem(queueKey(owner), JSON.stringify(queue));
    localStorage.setItem(learningStorageKey(LEGACY_QUEUE_KEY, owner), 'migrated');
  }
}

async function flush(owner: string, force: boolean): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || activeUserId !== owner || !navigator.onLine) {
    if (activeUserId === owner) setStatus('offline');
    return false;
  }
  setStatus('syncing');
  try {
    const key = queueKey(owner);
    await withQueueLock(owner, () => migrateLegacyQueue(owner));
    const pending: Queue = readObject(key);
    for (const [lessonId, item] of Object.entries(pending)) {
      if (activeUserId !== owner) return false;
      if (!force && item.retryAt > Date.now()) continue;
      const progress = item.progress;
      const { error } = await supabase.from('lesson_progress').upsert({
        user_id: owner, lesson_id: lessonId, status: progress.status,
        last_slide_index: progress.lastSlideIndex, quiz_score: progress.quizScore,
        completed_at: progress.completedAt, client_updated_at: progress.clientUpdatedAt,
      }, { onConflict: 'user_id,lesson_id' });
      await withQueueLock(owner, () => {
        const latest = readObject<QueueItem>(key);
        if (latest[lessonId]?.token !== item.token) return;
        if (error) {
          const backoff = Math.min(60_000 * 5, 1_000 * 2 ** Math.min(item.attempts, 9));
          latest[lessonId] = { ...item, attempts: item.attempts + 1, retryAt: Date.now() + backoff };
        } else {
          delete latest[lessonId];
        }
        localStorage.setItem(key, JSON.stringify(latest));
      });
    }

    const { data, error } = await supabase.from('lesson_progress').select('*').eq('user_id', owner);
    if (error) throw error;
    if (activeUserId !== owner) return false;
    await withQueueLock(owner, () => {
      const local = getAllLocalProgress(owner);
      for (const remote of data) {
        const prior = local[remote.lesson_id];
        if (prior && Date.parse(prior.clientUpdatedAt) > Date.parse(remote.client_updated_at)) continue;
        local[remote.lesson_id] = {
          lessonId: remote.lesson_id, status: remote.status, lastSlideIndex: remote.last_slide_index,
          quizScore: remote.quiz_score, completedAt: remote.completed_at, clientUpdatedAt: remote.client_updated_at,
        };
      }
      localStorage.setItem(learningStorageKey(LOCAL_PROGRESS_STORAGE_KEY, owner), JSON.stringify(local));
    });
    const remaining = Object.values(readObject<QueueItem>(key));
    if (activeUserId !== owner) return false;
    lastSyncAt = remaining.length ? lastSyncAt : Date.now();
    setStatus(remaining.some(item => item.attempts) ? 'error' : remaining.length ? 'pending' : 'synced');
    window.dispatchEvent(new Event(LEARNING_UPDATED_EVENT));
    return remaining.length === 0;
  } catch (error) {
    if (activeUserId === owner) {
      console.warn('Đồng bộ tiến độ thất bại:', error);
      setStatus('error');
    }
    return false;
  }
}

export function flushSyncQueue(owner: string, force = false): Promise<boolean> {
  const current = inFlight.get(owner);
  if (current) return current;
  const next = flush(owner, force).finally(() => {
    inFlight.delete(owner);
    schedule(owner);
  });
  inFlight.set(owner, next);
  return next;
}

export function startProgressSync(owner?: string): () => void {
  activeUserId = owner;
  lastSyncAt = null;
  const online = () => { if (owner) void flushSyncQueue(owner); };
  const offline = () => setStatus('offline');
  const storage = (event: StorageEvent) => {
    if (owner && event.key === queueKey(owner)) schedule(owner);
  };
  setStatus(owner && navigator.onLine ? 'pending' : 'offline');
  window.addEventListener('online', online);
  window.addEventListener('offline', offline);
  window.addEventListener('storage', storage);
  online();
  return () => {
    window.removeEventListener('online', online);
    window.removeEventListener('offline', offline);
    window.removeEventListener('storage', storage);
    clearTimeout(retryTimer);
    if (activeUserId === owner) activeUserId = undefined;
  };
}
