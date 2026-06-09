import { useAfroStore } from '@/stores'
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

const apiUrl = "https://api.afrorevive.com"

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

    // Get token from auth store
    const token = useAfroStore.getState().token

    if (token) {
      req.headers.Authorization = `Bearer ${token}`
    }
    return req
  },
  (err) => {
    return Promise.reject(err)
  },
)

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
