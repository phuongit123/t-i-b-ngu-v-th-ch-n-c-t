import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getAllLocalProgress,
  clearProgressQueue,
  LOCAL_PROGRESS_STORAGE_KEY,
  LEARNING_UPDATED_EVENT,
  saveLessonProgress,
  type LocalLessonProgress,
} from '@/lib/supabase/progress-sync';
import { ALL_PILOT_LESSONS, ALL_PILOT_MODULES } from '@/data/curriculum/index';
import type { AffinityTrackId } from '@/types/design-system';
import { learningStorageKey } from '@/lib/learning-storage';
import { useAuth } from '@/lib/supabase/auth-context';

export interface ChallengeScoreRecord {
  score: number;
  passed: boolean;
  completedAt: string;
  measured?: true;
}

export interface LearningActivityState {
  studyDates: string[];
  extraStudyMinutes: number;
  challengeScores: Record<string, ChallengeScoreRecord>;
}

export const ACTIVITY_STORAGE_KEY = 'affinity_academy_activity_v1';

const LEGACY_PROGRESS_STORAGE_KEY = 'affinity_lesson_progress';
const LEGACY_CHALLENGES_STORAGE_KEY = 'affinity_challenges_progress';

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function readActivityState(): LearningActivityState {
  if (typeof window === 'undefined') {
    return { studyDates: [], extraStudyMinutes: 0, challengeScores: {} };
  }
  try {
    const raw = localStorage.getItem(learningStorageKey(ACTIVITY_STORAGE_KEY));
    if (!raw) {
      return { studyDates: [], extraStudyMinutes: 0, challengeScores: {} };
    }
    const parsed = JSON.parse(raw) as Partial<LearningActivityState>;
    return {
      studyDates: Array.isArray(parsed.studyDates) ? parsed.studyDates : [],
      extraStudyMinutes:
        typeof parsed.extraStudyMinutes === 'number' ? parsed.extraStudyMinutes : 0,
      challengeScores:
        parsed.challengeScores && typeof parsed.challengeScores === 'object'
          ? Object.fromEntries(Object.entries(parsed.challengeScores).filter(([, score]) => score?.measured === true))
          : {},
    };
  } catch {
    return { studyDates: [], extraStudyMinutes: 0, challengeScores: {} };
  }
}

function writeActivityState(state: LearningActivityState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(learningStorageKey(ACTIVITY_STORAGE_KEY), JSON.stringify(state));
  } catch (err) {
    console.warn('Không thể lưu dữ liệu hoạt động học tập:', err);
  }
}

function recordStudyDayAndMinutes(minutesDelta = 0): LearningActivityState {
  const state = readActivityState();
  const today = getTodayDateString();
  const studyDates = state.studyDates.includes(today)
    ? state.studyDates
    : [...state.studyDates, today];
  const next: LearningActivityState = {
    ...state,
    studyDates,
    extraStudyMinutes: state.extraStudyMinutes + Math.max(0, minutesDelta),
  };
  writeActivityState(next);
  return next;
}

function notifyLearningUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(LEARNING_UPDATED_EVENT));
}

/**
 * Calculates consecutive study days ending on the most recent study day (0 when no activity yet).
 */
export function computeActiveStreakDays(studyDates: string[]): number {
  if (studyDates.length === 0) return 0;
  const uniqueSorted = [...new Set(studyDates)].sort();
  let streak = 1;
  for (let i = uniqueSorted.length - 1; i > 0; i--) {
    const curr = new Date(`${uniqueSorted[i]}T00:00:00Z`).getTime();
    const prev = new Date(`${uniqueSorted[i - 1]}T00:00:00Z`).getTime();
    const diffDays = Math.round((curr - prev) / 86_400_000);
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      break;
    }
  }
  return streak;
}

/**
 * Records a slide visit in offline-first progress storage while preserving completed status.
 */
export function recordLessonSlideVisit(
  userId: string | null,
  lessonId: string,
  slideIndex: number
): void {
  const existing = getAllLocalProgress()[lessonId];
  const nextStatus = existing?.status === 'completed' ? 'completed' : 'in_progress';

  void saveLessonProgress(userId, {
    lessonId,
    status: nextStatus,
    lastSlideIndex: slideIndex,
    quizScore: existing?.quizScore ?? null,
    completedAt: existing?.completedAt ?? null,
  }).then(notifyLearningUpdated, console.warn);

  recordStudyDayAndMinutes(1);
  notifyLearningUpdated();
}

/**
 * Marks a lesson completed, persists to local storage + Supabase sync queue, and emits update event.
 */
export async function markLessonCompleted(
  userId: string | null,
  lessonId: string,
  lastSlideIndex: number,
  quizScore?: number | null
): Promise<void> {
  const existing = getAllLocalProgress()[lessonId];
  const completedAt = existing?.completedAt ?? new Date().toISOString();

  await saveLessonProgress(userId, {
    lessonId,
    status: 'completed',
    lastSlideIndex,
    quizScore: quizScore !== undefined ? quizScore : existing?.quizScore ?? null,
    completedAt,
  });

  recordStudyDayAndMinutes(0);
  notifyLearningUpdated();
}

/**
 * Records a practice challenge attempt score and updates overall dashboard metrics.
 */
export function recordChallengeAttempt(
  challengeId: string,
  score: number,
  passed: boolean
): void {
  const state = readActivityState();
  const prev = state.challengeScores[challengeId];
  const completedAt = new Date().toISOString();
  const today = getTodayDateString();
  const studyDates = state.studyDates.includes(today)
    ? state.studyDates
    : [...state.studyDates, today];

  const next: LearningActivityState = {
    ...state,
    studyDates,
    challengeScores: {
      ...state.challengeScores,
      [challengeId]: {
        score: prev ? Math.max(prev.score, score) : score,
        passed: Boolean(prev?.passed || passed),
        completedAt,
        measured: true,
      },
    },
  };
  writeActivityState(next);
  notifyLearningUpdated();
}

/**
 * Clears all local lesson, activity, queue, and legacy progress caches.
 */
function resetAllLearningProgress(userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    clearProgressQueue(userId);
    for (const key of [LOCAL_PROGRESS_STORAGE_KEY, ACTIVITY_STORAGE_KEY, LEGACY_PROGRESS_STORAGE_KEY, LEGACY_CHALLENGES_STORAGE_KEY]) {
      localStorage.removeItem(learningStorageKey(key));
    }
  } catch (err) {
    console.warn('Lỗi khi đặt lại tiến độ học tập:', err);
  }
  notifyLearningUpdated();
}

export interface ModuleProgressSummary {
  completed: number;
  total: number;
  percentage: number;
}

export interface UseLearningProgressResult {
  progressMap: Record<string, LocalLessonProgress>;
  completedLessonIds: string[];
  inProgressLessonIds: string[];
  completedCount: number;
  totalLessonsCount: number;
  activeStreakDays: number;
  totalStudyMinutes: number;
  challengeScores: Record<string, ChallengeScoreRecord>;
  getModuleProgress: (moduleId: string) => ModuleProgressSummary;
  getTrackProgress: (trackId: AffinityTrackId) => ModuleProgressSummary;
  resetAllLearningProgress: () => void;
}

/**
 * React hook subscribing to live lesson completion, study streak, and challenge progress.
 */
export function useLearningProgress(): UseLearningProgressResult {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<string, LocalLessonProgress>>(() =>
    getAllLocalProgress()
  );
  const [activity, setActivity] = useState<LearningActivityState>(() => readActivityState());

  const refresh = useCallback(() => {
    setProgressMap(getAllLocalProgress());
    setActivity(readActivityState());
  }, []);

  useEffect(() => {
    window.addEventListener(LEARNING_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(LEARNING_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const completedLessonIds = useMemo(
    () =>
      Object.values(progressMap)
        .filter((item) => item.status === 'completed')
        .map((item) => item.lessonId),
    [progressMap]
  );

  const inProgressLessonIds = useMemo(
    () =>
      Object.values(progressMap)
        .filter((item) => item.status === 'in_progress')
        .map((item) => item.lessonId),
    [progressMap]
  );

  const totalLessonsCount = ALL_PILOT_LESSONS.length;
  const completedCount = completedLessonIds.length;

  const activeStreakDays = useMemo(
    () => computeActiveStreakDays(activity.studyDates),
    [activity.studyDates]
  );

  const totalStudyMinutes = useMemo(() => {
    const completedMinutes = ALL_PILOT_LESSONS.reduce(
      (sum, lesson) =>
        completedLessonIds.includes(lesson.id) ? sum + lesson.durationMinutes : sum,
      0
    );
    return completedMinutes + activity.extraStudyMinutes;
  }, [completedLessonIds, activity.extraStudyMinutes]);

  const getModuleProgress = useCallback(
    (moduleId: string): ModuleProgressSummary => {
      const mod = ALL_PILOT_MODULES.find((m) => m.id === moduleId);
      if (!mod || mod.lessons.length === 0) {
        return { completed: 0, total: 0, percentage: 0 };
      }
      const total = mod.lessons.length;
      const completed = mod.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
      return {
        completed,
        total,
        percentage: Math.round((completed / total) * 100),
      };
    },
    [completedLessonIds]
  );

  const getTrackProgress = useCallback(
    (trackId: AffinityTrackId): ModuleProgressSummary => {
      const trackLessons = ALL_PILOT_LESSONS.filter((l) => l.trackId === trackId);
      if (trackLessons.length === 0) {
        return { completed: 0, total: 0, percentage: 0 };
      }
      const total = trackLessons.length;
      const completed = trackLessons.filter((l) => completedLessonIds.includes(l.id)).length;
      return {
        completed,
        total,
        percentage: Math.round((completed / total) * 100),
      };
    },
    [completedLessonIds]
  );

  return {
    progressMap,
    completedLessonIds,
    inProgressLessonIds,
    completedCount,
    totalLessonsCount,
    activeStreakDays,
    totalStudyMinutes,
    challengeScores: activity.challengeScores,
    getModuleProgress,
    getTrackProgress,
    resetAllLearningProgress: () => resetAllLearningProgress(user?.id),
  };
}
