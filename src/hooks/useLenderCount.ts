import { useEffect, useState } from "react";

export function useLenderCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const loadCount = async () => {
      setCount(null);
    };

    void loadCount();
  }, []);

  return count;
}
