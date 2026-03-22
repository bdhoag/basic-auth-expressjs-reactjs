import { api } from "./api"

export type User = {
  id: string
  name: string
  email: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type SignupRequest = {
  name: string
  email: string
  password: string
}

export type AuthResponse = {
  message: string
  user: User
  accessToken: string
  refreshToken: string
}

type MeResponse = {
  user: User
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", data)
  return response.data
}

export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/signup", data)
  return response.data
}

export async function getMe(): Promise<User> {
  const response = await api.get<MeResponse>("/me")
  return response.data.user
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/refresh", {
    refreshToken: token,
  })
  return response.data
}

export async function logoutApi(token: string): Promise<void> {
  await api.post("/auth/logout", { refreshToken: token })
}
