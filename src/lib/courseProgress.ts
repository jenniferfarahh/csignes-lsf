// src/lib/courseProgress.ts
export type WatchedMap = Record<string, Record<string, boolean>>;
// watched[lessonId][stepId] = true/false

export type LessonProgress = {
  watched: WatchedMap;
  completed: Record<string, boolean>;
  totalMinutes: number;
};

const KEY = "csignes_course_progress_v1";

function defaultState(): LessonProgress {
  return { watched: {}, completed: {}, totalMinutes: 0 };
}

export function loadCourseProgress(): LessonProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as LessonProgress;
    return {
      watched: parsed.watched ?? {},
      completed: parsed.completed ?? {},
      totalMinutes: parsed.totalMinutes ?? 0,
    };
  } catch {
    return defaultState();
  }
}

export function saveCourseProgress(state: LessonProgress) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function isStepWatched(state: LessonProgress, lessonId: string, stepId: string): boolean {
  return !!state.watched?.[lessonId]?.[stepId];
}

export function markStepWatched(
  state: LessonProgress,
  lessonId: string,
  stepId: string,
  minutesToAdd: number
): LessonProgress {
  const next = structuredClone(state) as LessonProgress;

  if (!next.watched[lessonId]) next.watched[lessonId] = {};
  if (!next.watched[lessonId][stepId]) {
    // on ajoute les minutes UNE seule fois par vidéo terminée
    next.watched[lessonId][stepId] = true;
    next.totalMinutes = (next.totalMinutes ?? 0) + minutesToAdd;
  }
  return next;
}

export function markLessonCompleted(state: LessonProgress, lessonId: string): LessonProgress {
  const next = structuredClone(state) as LessonProgress;
  next.completed[lessonId] = true;
  return next;
}
