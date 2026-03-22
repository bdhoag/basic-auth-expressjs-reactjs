import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/services/auth-service"

const ACCESS_TOKEN_KEY = "accessToken"
const REFRESH_TOKEN_KEY = "refreshToken"

export type { User }

type AuthState = {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

function loadFromStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function persistToStorage(key: string, value: string | null) {
  try {
    if (value) {
      localStorage.setItem(key, value)
    } else {
      localStorage.removeItem(key)
    }
  } catch {
    // storage unavailable
  }
}

const storedAccessToken = loadFromStorage(ACCESS_TOKEN_KEY)

const initialState: AuthState = {
  user: null,
  accessToken: storedAccessToken,
  refreshToken: loadFromStorage(REFRESH_TOKEN_KEY),
  isAuthenticated: !!storedAccessToken,
}

type Credentials = {
  user: User
  accessToken: string
  refreshToken: string
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<Credentials>) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      persistToStorage(ACCESS_TOKEN_KEY, action.payload.accessToken)
      persistToStorage(REFRESH_TOKEN_KEY, action.payload.refreshToken)
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      persistToStorage(ACCESS_TOKEN_KEY, null)
      persistToStorage(REFRESH_TOKEN_KEY, null)
    },
  },
})

export const { setCredentials, setUser, logout } = authSlice.actions
export default authSlice.reducer
