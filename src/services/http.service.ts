import { useAfroStore } from '@/stores'
import { isTokenExpired } from '@/lib/token'
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

api.interceptors.request.use(
  (req) => {
    if (req.url?.includes('login') || req.url?.includes('register')) return req

    const token = useAfroStore.getState().token

    if (token) {
      if (isTokenExpired(token)) {
        useAfroStore.getState().clearAuth()
        return Promise.reject(new Error('Session expired. Please log in again.'))
      }
      req.headers.Authorization = `Bearer ${token}`
    }
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
