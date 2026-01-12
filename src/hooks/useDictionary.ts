import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export type DictionaryEntryApi = {
  id: string;
  word: string;
  videoUrl: string;
};

export function useDictionary() {
  return useQuery({
    queryKey: ["dictionary"],
    queryFn: () => apiGet<DictionaryEntryApi[]>("/api/dictionary"),
  });
}
