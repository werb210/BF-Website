import { ENV } from "@/config/env";

type ApiSuccess<T> = { success: true; data: T };
type ApiError = { success: false; error: { message: string } };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const res = await fetch(`${ENV.API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: { message: json?.message || "Request failed" },
    };
  }

  return {
    success: true,
    data: json,
  };
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await api<T>(path, options);

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data;
}
