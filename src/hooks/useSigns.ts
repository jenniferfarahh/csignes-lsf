import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export type SignDTO = {
  id: string;
  word: string;
  description?: string | null;
  videoUrl: string;      // gif/mp4 url
  category: string;
  difficulty: string;
};

export function useSigns(q: string = "") {
  const [data, setData] = useState<SignDTO[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(false);

    apiGet<SignDTO[]>(`/api/dictionary${q ? `?q=${encodeURIComponent(q)}` : ""}`)
      .then((d) => mounted && setData(d))
      .catch(() => mounted && setError(true))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [q]);

  return { data, isLoading, isError };
}
