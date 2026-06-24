import { useEffect } from 'react'
import authService from '@/services/auth.service'
import { useAfroStore } from '@/stores'

const REFRESH_BEFORE_MS = 60 * 1000 // fire 1 minute before expiry

export function useTokenRefresh() {
  const token = useAfroStore((state) => state.token)
  const refreshToken = useAfroStore((state) => state.refreshToken)
  const tokenExpiry = useAfroStore((state) => state.tokenExpiry)
  const clearAuth = useAfroStore((state) => state.clearAuth)
  const setTokens = useAfroStore((state) => state.setTokens)

  useEffect(() => {
    if (!token || !refreshToken || !tokenExpiry) return

    const delay = tokenExpiry * 1000 - REFRESH_BEFORE_MS - Date.now()

    if (delay <= 0) {
      clearAuth()
      return
    }

    const timer = setTimeout(async () => {
      try {
        const response = await authService.refreshToken({ accessToken: token, refreshToken })
        setTokens(response.data.token, response.data.refreshToken)
      } catch {
        clearAuth()
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [token, refreshToken, tokenExpiry, clearAuth, setTokens])
}