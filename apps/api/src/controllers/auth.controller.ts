import { Request, Response } from "express"
import * as authService from "../services/auth.service"
import * as userService from "../services/user.service"
import { AppError } from "../types"

const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: "Name, email, and password are required" })
      return
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" })
      return
    }

    const { user, accessToken, refreshToken } = await authService.register({
      name,
      email,
      password,
    })

    res.status(201).json({
      message: "User created successfully",
      user,
      accessToken,
      refreshToken,
    })
  } catch (err) {
    const error = err as AppError
    if (error.name === "SequelizeValidationError" && error.errors) {
      const messages = error.errors.map((e) => e.message)
      res.status(400).json({ message: messages.join(", ") })
      return
    }
    const status = error.statusCode || 500
    res
      .status(status)
      .json({ message: error.message || "Internal server error" })
  }
}

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" })
      return
    }

    const { user, accessToken, refreshToken } = await authService.authenticate({
      email,
      password,
    })

    res
      .status(200)
      .json({ message: "Login successful", user, accessToken, refreshToken })
  } catch (err) {
    const error = err as AppError
    const status = error.statusCode || 500
    res
      .status(status)
      .json({ message: error.message || "Internal server error" })
  }
}

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body

    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await authService.refresh(refreshToken)

    res.status(200).json({
      message: "Token refreshed",
      user,
      accessToken,
      refreshToken: newRefreshToken,
    })
  } catch (err) {
    const error = err as AppError
    const status = error.statusCode || 500
    res
      .status(status)
      .json({ message: error.message || "Internal server error" })
  }
}

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body

    await authService.logout(refreshToken)

    res.status(200).json({ message: "Logged out successfully" })
  } catch (err) {
    const error = err as AppError
    const status = error.statusCode || 500
    res
      .status(status)
      .json({ message: error.message || "Internal server error" })
  }
}

const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.findById(req.user!.id)

    res.status(200).json({ user })
  } catch (err) {
    const error = err as AppError
    const status = error.statusCode || 500
    res
      .status(status)
      .json({ message: error.message || "Internal server error" })
  }
}

export { signup, login, refreshToken, logout, getMe }
