export async function retry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 500): Promise<T> {
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) {
        throw new Error("FAILED_AFTER_RETRY", { cause: error });
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error("FAILED_AFTER_RETRY");
}

export async function withLoading<T>(
  setLoading: (isLoading: boolean) => void,
  fn: () => Promise<T>,
): Promise<T> {
  setLoading(true);
  try {
    return await fn();
  } finally {
    setLoading(false);
  }
}
