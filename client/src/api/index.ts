import { apiFetch } from "./client";
import { API_BASE_URL } from "../config/api";

export function get(path: string, headers: any = {}) {
  return apiFetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers,
  });
}

export function post(path: string, body: any, headers: any = {}) {
  return apiFetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}
