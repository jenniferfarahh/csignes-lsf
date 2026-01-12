import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export type CourseApi = {
  id: string;
  title: string;
  lessonIds: string[];
};

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => apiGet<CourseApi[]>("/api/courses"),
  });
}
