import { JwtPayload } from "jsonwebtoken"

export interface AuthPayload extends JwtPayload {
  id: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export interface AppError extends Error {
  statusCode?: number
  errors?: { message: string }[]
}

export interface UserDTO {
  id: string
  name: string
  email: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface AuthResult extends TokenPair {
  user: UserDTO
}
