import crypto from "crypto"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User, RefreshToken } from "../models"
import { AppError, AuthResult } from "../types"

const SALT_ROUNDS = 10

const generateAccessToken = (user: { id: string; email: string }): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        "15m") as jwt.SignOptions["expiresIn"],
    }
  )
}

const generateRefreshToken = async (userId: string): Promise<string> => {
  const token = crypto.randomBytes(40).toString("hex")

  const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string, 10) || 7
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

  await RefreshToken.create({ token, userId, expiresAt })

  return token
}

const buildTokenPair = async (user: {
  id: string
  email: string
}): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = generateAccessToken(user)
  const refreshToken = await generateRefreshToken(user.id)
  return { accessToken, refreshToken }
}

const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message)
  error.statusCode = statusCode
  return error
}

const register = async ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}): Promise<AuthResult> => {
  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) {
    throw createError("Email already in use", 409)
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await User.create({ name, email, passwordHash })

  const tokens = await buildTokenPair(user)

  return {
    user: { id: user.id, name: user.name, email: user.email },
    ...tokens,
  }
}

const authenticate = async ({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<AuthResult> => {
  const user = await User.findOne({ where: { email } })
  if (!user) {
    throw createError("Invalid email or password", 401)
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    throw createError("Invalid email or password", 401)
  }

  const tokens = await buildTokenPair(user)

  return {
    user: { id: user.id, name: user.name, email: user.email },
    ...tokens,
  }
}

const refresh = async (token: string): Promise<AuthResult> => {
  if (!token) {
    throw createError("Refresh token is required", 400)
  }

  const stored = await RefreshToken.findOne({ where: { token } })
  if (!stored) {
    throw createError("Invalid refresh token", 401)
  }

  if (stored.expiresAt < new Date()) {
    await stored.destroy()
    throw createError("Refresh token has expired", 401)
  }

  const user = await User.findByPk(stored.userId)
  if (!user) {
    await stored.destroy()
    throw createError("User not found", 401)
  }

  await stored.destroy()
  const tokens = await buildTokenPair(user)

  return {
    user: { id: user.id, name: user.name, email: user.email },
    ...tokens,
  }
}

const logout = async (token: string): Promise<void> => {
  if (!token) {
    throw createError("Refresh token is required", 400)
  }

  const deleted = await RefreshToken.destroy({ where: { token } })
  if (!deleted) {
    throw createError("Invalid refresh token", 401)
  }
}

export { register, authenticate, refresh, logout }
