export type SafeFetchOptions = RequestInit & {
  retries?: number;
  retryDelayMs?: number;
  retryOnStatuses?: number[];
  allowHttpError?: boolean;
  httpErrorMessage?: string;
};

const DEFAULT_RETRYABLE_STATUSES = [408, 425, 429, 500, 502, 503, 504];

export class SafeFetchHttpError extends Error {
  status: number;
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.name = "SafeFetchHttpError";
    this.status = response.status;
    this.response = response;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function safeFetch(input: RequestInfo | URL, options: SafeFetchOptions = {}): Promise<Response> {
  const {
    retries = 1,
    retryDelayMs = 250,
    retryOnStatuses = DEFAULT_RETRYABLE_STATUSES,
    allowHttpError = false,
    httpErrorMessage,
    ...fetchOptions
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(input, fetchOptions);

      if (attempt < retries && retryOnStatuses.includes(response.status)) {
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }

      if (!response.ok && !allowHttpError) {
        const message = httpErrorMessage ?? `Request failed with status ${response.status}`;
        throw new SafeFetchHttpError(message, response);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt >= retries) break;
      await sleep(retryDelayMs * (attempt + 1));
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error("Network request failed");
}
