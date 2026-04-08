import { API_BASE } from '../config/api';

export async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((json as { error?: string })?.error || 'API error');
  }

  if ((json as { status?: string })?.status === 'ok') {
    return (json as { data?: unknown }).data ?? json;
  }

  throw new Error('API error');
}


export const apiFetch = api;
