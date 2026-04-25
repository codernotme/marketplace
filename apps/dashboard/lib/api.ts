import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use(
  (config: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => Promise.reject(error)
)

// Response interceptor for token refresh
api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Refresh token is handled by HTTP-only cookie
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, {
          withCredentials: true
        })
        const newToken = data.data.accessToken
        localStorage.setItem('accessToken', newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Clear auth state and redirect to login
        localStorage.removeItem('accessToken')
        try {
          const { useAuthStore } = await import('../modules/auth/store/authStore')
          useAuthStore.getState().clearAuth()
        } catch (e) {}

        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default api
