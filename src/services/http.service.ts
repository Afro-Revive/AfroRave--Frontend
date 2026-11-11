import { AUTH_STORAGE_KEY, useAfroStore } from '@/stores'
import { isTokenExpired, isTokenFresh } from '@/lib/token'
import type { RefreshTokenResponse } from '@/types/auth'
import axios from 'axios'

export const multipartHeaders = {
  headers: { 'Content-Type': 'multipart/form-data' },
}

// Staging is https://dev.afrorevive.com, production https://api.afrorevive.com,
// set per environment in Vercel. Deliberately no fallback — a default would
// quietly point production at staging whenever the variable is missing.
const apiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')

if (!apiUrl) {
  throw new Error(
    'Missing required environment variable: VITE_API_URL. Set it in .env.local ' +
      'locally, or in the Vercel project settings.',
  )
}

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Changed to false to avoid CORS preflight issues
})

let refreshInFlight: Promise<string | null> | null = null

/**
 * Swaps the session's tokens for new ones and returns the new access token, or
 * null (logged out) when the session can't be renewed.
 *
 * The API rotates refresh tokens: each one works once, and sending a used one
 * fails with "Invalid refresh token or token expired." So only one refresh may
 * run at a time — once per tab (the shared promise) and once across tabs (a Web
 * Lock) — and whoever runs next uses the pair the last refresh saved.
 */
export function refreshSession(): Promise<string | null> {
  refreshInFlight ??= withRefreshLock(renewTokens).finally(() => {
    refreshInFlight = null
  })
  return refreshInFlight
}

function withRefreshLock<T>(renew: () => Promise<T>): Promise<T> {
  return typeof navigator !== 'undefined' && navigator.locks
    ? navigator.locks.request('afro-token-refresh', renew)
    : renew()
}

/** The tokens saved in this browser, which another tab may have just renewed. */
function savedTokens(): { token: string; refreshToken: string } | null {
  try {
    const state = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? 'null')?.state
    return state?.token && state?.refreshToken
      ? { token: state.token, refreshToken: state.refreshToken }
      : null
  } catch {
    return null
  }
}

async function renewTokens(): Promise<string | null> {
  const { token, refreshToken, setTokens, clearAuth } = useAfroStore.getState()
  const saved = savedTokens()

  // Another tab renewed the session while this one waited for the lock.
  if (saved && isTokenFresh(saved.token)) {
    if (saved.token !== token) setTokens(saved.token, saved.refreshToken)
    return saved.token
  }

  const current = saved ?? (token && refreshToken ? { token, refreshToken } : null)

  if (!current) {
    clearAuth()
    return null
  }

  try {
    // Plain axios, not `api`: the request interceptor would wait on this very refresh.
    const { data } = await axios.post<RefreshTokenResponse>(`${apiUrl}/api/Auth/refresh`, {
      accessToken: current.token,
      refreshToken: current.refreshToken,
    })
    setTokens(data.token, data.refreshToken)
    return data.token
  } catch {
    // Without Web Locks, two tabs can still race. If the other one won, its pair is saved.
    const latest = savedTokens()

    if (latest && latest.token !== current.token && !isTokenExpired(latest.token)) {
      setTokens(latest.token, latest.refreshToken)
      return latest.token
    }

    clearAuth()
    return null
  }
}

api.interceptors.request.use(
  (req) => {
    if (req.url?.includes('login') || req.url?.includes('register')) return req

    const token = useAfroStore.getState().token

    // Expired means 15 minutes without a refresh, i.e. inactive: by design the
    // API won't renew it, so the session ends here.
    if (token && isTokenExpired(token)) {
      useAfroStore.getState().clearAuth()
      return Promise.reject(new Error('Session expired. Please log in again.'))
    }

    if (token) req.headers.Authorization = `Bearer ${token}`
    return req
  },
  (err) => Promise.reject(err),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If no token exists in the store no need to clear auth state, just return the error
    if (error.response?.status === 401 && useAfroStore.getState().token) {
      useAfroStore.getState().clearAuth()
    }
    return Promise.reject(error)
  },
)

export default api
