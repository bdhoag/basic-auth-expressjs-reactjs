import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const TOKEN_KEY = "accessToken"

export type User = {
  id: string
  email: string
  name: string
}

type AuthState = {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
}

function loadTokenFromStorage(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function persistToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // storage unavailable
  }
}

const storedToken = loadTokenFromStorage()

const initialState: AuthState = {
  user: null,
  accessToken: storedToken,
  isAuthenticated: !!storedToken,
}

type Credentials = {
  user: User
  accessToken: string
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<Credentials>) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = true
      persistToken(action.payload.accessToken)
    },
    logout(state) {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      persistToken(null)
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
