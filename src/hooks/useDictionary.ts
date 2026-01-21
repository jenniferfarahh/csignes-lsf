import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export type SignApi = {
  id: string;
  word: string;
  videoUrl: string;
};

export function useDictionary(params?: { q?: string; category?: string }) {
  return useQuery({
    queryKey: ["dictionary", params?.q ?? "", params?.category ?? ""],
    queryFn: () => {
      const q = params?.q?.trim();
      const category = params?.category?.trim();

      const search = new URLSearchParams();
      if (q) search.set("q", q);
      if (category) search.set("category", category);

      const qs = search.toString();
      const url = "/api/dictionary" + (qs ? "?" + qs : "");

      return apiGet<SignApi[]>(url);
    },
  });
}

