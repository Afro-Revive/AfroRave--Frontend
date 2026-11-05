import type { AxiosError } from 'axios'

/**
 * The server's own explanation of a failed request, most specific first: each
 * field's validation message, then the response's message, then its title.
 * The fallback is for when it sent nothing readable (the network failed, say).
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  const data = (error as AxiosError<unknown>)?.response?.data

  // Some endpoints answer in plain text.
  if (typeof data === 'string') return data.trim() || fallback
  if (!data || typeof data !== 'object') return fallback

  const body = data as Record<string, unknown>

  if (body.errors && typeof body.errors === 'object') {
    const messages = Object.values(body.errors)
      .flat()
      .filter((message): message is string => typeof message === 'string' && message.trim() !== '')

    if (messages.length > 0) return messages.join(' ')
  }

  for (const key of ['message', 'title']) {
    const value = body[key]
    if (typeof value === 'string' && value.trim()) return value
  }

  return fallback
}
