/** Access tokens are renewed this long before they expire. */
export const REFRESH_BEFORE_MS = 3 * 60 * 1000

export function decodeTokenExpiry(token: string): number | null {
  try {
    const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64Payload))
    return typeof payload.exp === 'number' ? payload.exp : null
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const exp = decodeTokenExpiry(token)
  if (exp === null) return true
  return Date.now() >= exp * 1000
}

/** Valid for longer than the renewal window, so there's no need to renew it yet. */
export function isTokenFresh(token: string): boolean {
  const exp = decodeTokenExpiry(token)
  if (exp === null) return false
  return exp * 1000 - Date.now() > REFRESH_BEFORE_MS
}
