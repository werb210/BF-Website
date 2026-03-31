import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export function useLenderCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const loadCount = async () => {
      const result = await apiRequest<{ count?: number }>("/api/public/lender-count", { method: "GET" });
      if (!result.success) {
        setCount(null);
        return;
      }

      setCount(result.data?.count ?? null);
    };

    void loadCount();
  }, []);

  return count;
}
