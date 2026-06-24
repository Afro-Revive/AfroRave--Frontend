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
