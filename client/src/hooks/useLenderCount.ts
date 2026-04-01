import { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";

export function useLenderCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const result = await apiGet<{ count?: number }>("/api/public/lender-count");
        setCount(result.count ?? null);
      } catch {
        setCount(null);
      }
    };

    void loadCount();
  }, []);

  return count;
}
