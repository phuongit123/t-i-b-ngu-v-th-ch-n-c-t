const STORAGE_KEY = 'affinity_lesson_progress';

export interface LocalLessonCompletion {
  completedLessons: string[];
  lastSavedAt: string | null;
}

export function readLessonCompletion(): LocalLessonCompletion {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    // Both the old array and object shapes were previously accepted by the dashboard.
    const ids = Array.isArray(parsed) ? parsed : parsed?.completedLessons;
    const date = parsed?.lastSavedAt;
    return {
      completedLessons: Array.isArray(ids)
        ? [...new Set(ids.filter((id): id is string => typeof id === 'string'))]
        : [],
      lastSavedAt: typeof date === 'string' && Number.isFinite(Date.parse(date)) ? date : null,
    };
  } catch {
    return { completedLessons: [], lastSavedAt: null };
  }
}

export function recordLessonCompletion(lessonId: string): LocalLessonCompletion {
  const current = readLessonCompletion();
  if (current.completedLessons.includes(lessonId)) return current;

  const next = {
    completedLessons: [...current.completedLessons, lessonId],
    lastSavedAt: new Date().toISOString(),
  };
  // Let the caller handle a failed storage write rather than reporting success.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
