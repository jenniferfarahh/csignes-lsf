import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export type ProgressApi = {
  userId: string;
  xp: number;
  completedLessons: string[];
};

export function useProgress(userId: string) {
  return useQuery({
    queryKey: ["progress", userId],
    queryFn: () => apiGet<ProgressApi>(`/api/progress/${userId}`),
  });
}
