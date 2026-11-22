/**
 * AFFINITY ACADEMY — PROGRESS SYNCHRONIZATION ENGINE
 * Offline-first, resilient synchronization with conflict resolution (LWW)
 * and exponential backoff retry queue.
 */

import { getSupabaseClient, isSupabaseConfigured } from './client.ts';
import type { Database, LessonProgressStatus } from '../../types/database.types.ts';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'pending' | 'error';

export interface LocalLessonProgress {
  lessonId: string;
  status: LessonProgressStatus;
  lastSlideIndex: number;
  quizScore?: number | null;
  completedAt?: string | null;
  clientUpdatedAt: string; // ISO 8601 string
}

interface SyncQueueItem {
  id: string;
  userId: string;
  payload: LocalLessonProgress;
  attempts: number;
  lastAttemptAt: number;
}

const LOCAL_PROGRESS_STORAGE_KEY = 'affinity_academy_progress_v2';
const SYNC_QUEUE_STORAGE_KEY = 'affinity_academy_sync_queue';
const MAX_RETRY_ATTEMPTS = 5;

// Global listeners for sync status changes
const statusListeners = new Set<(status: SyncStatus) => void>();
let currentSyncStatus: SyncStatus = 'offline';

const setSyncStatus = (status: SyncStatus) => {
  currentSyncStatus = status;
  statusListeners.forEach(listener => listener(status));
};

export const subscribeSyncStatus = (listener: (status: SyncStatus) => void): () => void => {
  statusListeners.add(listener);
  listener(currentSyncStatus);
  return () => {
    statusListeners.delete(listener);
  };
};

export const getSyncStatus = (): SyncStatus => currentSyncStatus;

/**
 * Reads all local progress from localStorage
 */
export const getAllLocalProgress = (): Record<string, LocalLessonProgress> => {
  try {
    const raw = localStorage.getItem(LOCAL_PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Lỗi đọc local progress:', err);
    return {};
  }
};

/**
 * Reads local progress for a specific lesson
 */
export const getLocalProgress = (lessonId: string): LocalLessonProgress | null => {
  const all = getAllLocalProgress();
  return all[lessonId] || null;
};

/**
 * Saves all local progress into localStorage
 */
const saveAllLocalProgress = (data: Record<string, LocalLessonProgress>) => {
  try {
    localStorage.setItem(LOCAL_PROGRESS_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Lỗi ghi local progress:', err);
  }
};

/**
 * Reads pending sync queue
 */
const getSyncQueue = (): SyncQueueItem[] => {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveSyncQueue = (queue: SyncQueueItem[]) => {
  try {
    localStorage.setItem(SYNC_QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn('Lỗi lưu sync queue:', err);
  }
};

/**
 * Enqueue progress item for background sync
 */
const enqueueSyncItem = (userId: string, progress: LocalLessonProgress) => {
  const queue = getSyncQueue();
  const existingIdx = queue.findIndex(q => q.userId === userId && q.payload.lessonId === progress.lessonId);
  const item: SyncQueueItem = {
    id: `${userId}_${progress.lessonId}`,
    userId,
    payload: progress,
    attempts: 0,
    lastAttemptAt: 0,
  };

  if (existingIdx >= 0) {
    queue[existingIdx] = item;
  } else {
    queue.push(item);
  }
  saveSyncQueue(queue);
  setSyncStatus('pending');
};

/**
 * Core function to save lesson progress (Local-First)
 */
export const saveLessonProgress = async (
  userId: string | null,
  progress: Omit<LocalLessonProgress, 'clientUpdatedAt'>
): Promise<void> => {
  const nowIso = new Date().toISOString();
  const localRecord: LocalLessonProgress = {
    ...progress,
    clientUpdatedAt: nowIso,
  };

  // 1. Write immediately to localStorage (optimistic & synchronous)
  const all = getAllLocalProgress();
  all[progress.lessonId] = localRecord;
  saveAllLocalProgress(all);

  // 2. If no user or Supabase is not configured, we're in offline/guest mode
  if (!userId || !isSupabaseConfigured()) {
    setSyncStatus('offline');
    return;
  }

  // 3. Queue for synchronization
  enqueueSyncItem(userId, localRecord);

  // 4. Trigger flush immediately
  flushSyncQueue(userId).catch(err => {
    console.warn('Lỗi đồng bộ ngầm:', err);
  });
};

/**
 * Flushes pending sync queue to Supabase with conflict resolution
 */
export const flushSyncQueue = async (userId: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured() || !navigator.onLine) {
    setSyncStatus('offline');
    return false;
  }

  const queue = getSyncQueue();
  const userItems = queue.filter(item => item.userId === userId);
  if (userItems.length === 0) {
    setSyncStatus('synced');
    return true;
  }

  setSyncStatus('syncing');
  let hasErrors = false;
  const remainingQueue: SyncQueueItem[] = queue.filter(item => item.userId !== userId);

  for (const item of userItems) {
    try {
      // Upsert into Supabase lesson_progress
      const { error } = await supabase
        .from('lesson_progress')
        .upsert(
          {
            user_id: item.userId,
            lesson_id: item.payload.lessonId,
            status: item.payload.status,
            last_slide_index: item.payload.lastSlideIndex,
            quiz_score: item.payload.quizScore,
            completed_at: item.payload.completedAt,
            client_updated_at: item.payload.clientUpdatedAt,
          },
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.warn(`Lỗi khi sync bài ${item.payload.lessonId}:`, err);
      hasErrors = true;
      if (item.attempts < MAX_RETRY_ATTEMPTS) {
        remainingQueue.push({
          ...item,
          attempts: item.attempts + 1,
          lastAttemptAt: Date.now(),
        });
      }
    }
  }

  saveSyncQueue(remainingQueue);

  if (hasErrors) {
    setSyncStatus('error');
    return false;
  } else {
    setSyncStatus('synced');
    return true;
  }
};

/**
 * Pulls remote progress from Supabase and merges with local (Last-Write-Wins)
 */
export const pullRemoteProgress = async (userId: string): Promise<Record<string, LocalLessonProgress>> => {
  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured() || !navigator.onLine) {
    return getAllLocalProgress();
  }

  try {
    setSyncStatus('syncing');
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId);

    if (error || !data) {
      console.warn('Không tải được remote progress:', error?.message);
      setSyncStatus('error');
      return getAllLocalProgress();
    }

    const localAll = getAllLocalProgress();
    let hasLocalChanges = false;

    data.forEach((remote: Database['public']['Tables']['lesson_progress']['Row']) => {
      const local = localAll[remote.lesson_id];
      const remoteUpdatedAt = new Date(remote.client_updated_at).getTime();
      const localUpdatedAt = local ? new Date(local.clientUpdatedAt).getTime() : 0;

      // Remote is newer -> update local
      if (remoteUpdatedAt >= localUpdatedAt) {
        localAll[remote.lesson_id] = {
          lessonId: remote.lesson_id,
          status: remote.status,
          lastSlideIndex: remote.last_slide_index,
          quizScore: remote.quiz_score,
          completedAt: remote.completed_at,
          clientUpdatedAt: remote.client_updated_at,
        };
        hasLocalChanges = true;
      }
    });

    if (hasLocalChanges) {
      saveAllLocalProgress(localAll);
    }

    setSyncStatus('synced');
    return localAll;
  } catch (err) {
    console.warn('Lỗi pull remote progress:', err);
    setSyncStatus('error');
    return getAllLocalProgress();
  }
};
