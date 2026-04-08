import { apiFetch } from "./client";

export function get(path: string, headers: any = {}) {
  return apiFetch(path, {
    method: "GET",
    headers,
  });
}

export function post(path: string, body: any, headers: any = {}) {
  return apiFetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}
