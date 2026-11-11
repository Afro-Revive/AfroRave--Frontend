import { useEffect } from 'react'
import { REFRESH_BEFORE_MS } from '@/lib/token'
import { refreshSession } from '@/services/http.service'
import { useAfroStore } from '@/stores'

/**
 * Renews the access token shortly before it expires. With less than that left
 * (or already expired, after the tab slept or was closed) it renews straight
 * away: the refresh token is still good, so there's no reason to log out.
 */
export function useTokenRefresh() {
  const token = useAfroStore((state) => state.token)
  const refreshToken = useAfroStore((state) => state.refreshToken)
  const tokenExpiry = useAfroStore((state) => state.tokenExpiry)

  useEffect(() => {
    if (!token || !refreshToken || !tokenExpiry) return

    const delay = Math.max(tokenExpiry * 1000 - REFRESH_BEFORE_MS - Date.now(), 0)
    const timer = setTimeout(() => void refreshSession(), delay)

    return () => clearTimeout(timer)
  }, [token, refreshToken, tokenExpiry])
}
