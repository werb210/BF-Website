export type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
};

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  method?: string;
  body?: unknown;
};

export class ApiClientError<TPayload = unknown> extends Error {
  status: number;
  payload: TPayload;

  constructor(status: number, payload: TPayload) {
    super(`Request failed with status ${status}`);
    this.name = "ApiClientError";
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest<T>(
  url: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers || {});

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const serializedBody: BodyInit | null | undefined =
    options.body === undefined
      ? undefined
      : options.body === null
        ? null
        : isFormData || typeof options.body === "string"
          ? (options.body as BodyInit)
          : JSON.stringify(options.body);

  const res = await fetch(url, {
    ...options,
    method: options.method || "GET",
    headers,
    body: serializedBody,
  });

  const text = await res.text();
  const parsed = text ? (JSON.parse(text) as T) : ({} as T);

  if (!res.ok) {
    throw new ApiClientError(res.status, parsed);
  }

  return parsed;
}
