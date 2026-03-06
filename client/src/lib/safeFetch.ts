export async function safeFetch(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options)

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`HTTP ${response.status}: ${text}`)
  }

  return response
}
