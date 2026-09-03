import { useAfroStore } from '@/stores'
import { isTokenExpired } from '@/lib/token'
import axios from 'axios'

export const multipartHeaders = {
  headers: { 'Content-Type': 'multipart/form-data' },
}

// Force development mode for now to use proxy
// const isDev =
//   import.meta.env.DEV ||
//   import.meta.env.MODE === 'development' ||
//   window.location.hostname === 'localhost'

// const apiUrl = isDev
//   ? '' // Use relative URLs in development (proxy will handle it)
//   : import.meta.env.VITE_API_PROD || 'https://afro-revive-latest.onrender.com'

const apiUrl = "https://dev.afrorevive.com/"

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
