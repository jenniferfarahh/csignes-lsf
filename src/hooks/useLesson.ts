import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export type LessonApi = {
  id: string;
  title: string;
  steps: Array<{
    type: "video" | "qcm";
    videoUrl?: string;
    question?: string;
    choices?: string[];
    correctIndex?: number;
  }>;
};

export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => apiGet<LessonApi>(`/api/lessons/${lessonId}`),
  });
}
