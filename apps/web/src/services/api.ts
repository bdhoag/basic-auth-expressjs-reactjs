import axios, { type InternalAxiosRequestConfig } from "axios"
import { store } from "@/app/store"
import { setCredentials, logout } from "@/features/auth/authSlice"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const AUTH_ENDPOINTS = ["/auth/login", "/auth/signup", "/auth/refresh", "/auth/logout"]

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false
  return AUTH_ENDPOINTS.some((ep) => url.endsWith(ep))
}

let refreshPromise: Promise<string> | null = null

function performRefresh(currentRefreshToken: string): Promise<string> {
  return axios
    .post<{
      accessToken: string
      refreshToken: string
      user: { id: string; name: string; email: string }
    }>(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: currentRefreshToken,
    })
    .then(({ data }) => {
      store.dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      )
      return data.accessToken
    })
    .finally(() => {
      refreshPromise = null
    })
}

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest | undefined

    if (
      !axios.isAxiosError(error) ||
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const currentRefreshToken = store.getState().auth.refreshToken
    if (!currentRefreshToken) {
      store.dispatch(logout())
      window.location.href = "/login"
      return Promise.reject(error)
    }

    try {
      if (!refreshPromise) {
        refreshPromise = performRefresh(currentRefreshToken)
      }
      const newAccessToken = await refreshPromise

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return api(originalRequest)
    } catch {
      store.dispatch(logout())
      window.location.href = "/login"
      return Promise.reject(error)
    }
  }
)
