// BF_WEBSITE_v789_CONVERSATION_TOKEN - failures carry the HTTP status so a
// caller can tell "the server refused this" (401/403) from a network blip.
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, body: string) {
    super(`HTTP ${status}: ${body}`);
    this.name = "HttpError";
    this.status = status;
  }
}

export async function safeFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options)

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new HttpError(res.status, text)
  }

  const contentType = res.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return res.json()
  }

  return res.text()
}
