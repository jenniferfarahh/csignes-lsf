import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export type ProgressApi = {
  userId: string;
  xp: number;
  completedLessons: string[];
  lastLessonId?: string | null;
  lastUserAnswer?: number | null;
  lastWasCorrect?: boolean | null;
  lastXpEarned?: number | null;
};

export function useProgress() {
  return useQuery({
    queryKey: ["progress", "me"],
    queryFn: () => apiGet<ProgressApi>(`/api/progress/me`),
  });
}
// This hook fetches the progress of the currently logged-in user (based on the access token).