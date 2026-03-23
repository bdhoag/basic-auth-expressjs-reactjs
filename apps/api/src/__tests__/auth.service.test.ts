import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import * as authService from "../services/auth.service"
import { User, RefreshToken } from "../models"

jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  RefreshToken: {
    create: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  },
}))

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-access-token"),
}))

process.env.JWT_SECRET = "test-secret"
process.env.JWT_EXPIRES_IN = "15m"
process.env.JWT_REFRESH_EXPIRES_IN = "7"

const mockUser = {
  id: "user-uuid-1",
  name: "John Doe",
  email: "john@example.com",
  passwordHash: "hashed-password",
}

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("register", () => {
    it("should register a new user and return tokens", async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password")
      ;(User.create as jest.Mock).mockResolvedValue(mockUser)
      ;(RefreshToken.create as jest.Mock).mockResolvedValue({})

      const result = await authService.register({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      })

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      })
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10)
      expect(User.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        passwordHash: "hashed-password",
      })
      expect(result.user).toEqual({
        id: "user-uuid-1",
        name: "John Doe",
        email: "john@example.com",
      })
      expect(result.accessToken).toBe("mock-access-token")
      expect(result.refreshToken).toBeDefined()
    })

    it("should throw 409 if email already exists", async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)

      await expect(
        authService.register({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        })
      ).rejects.toThrow("Email already in use")
    })
  })

  describe("authenticate", () => {
    it("should authenticate user with valid credentials", async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(RefreshToken.create as jest.Mock).mockResolvedValue({})

      const result = await authService.authenticate({
        email: "john@example.com",
        password: "password123",
      })

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      })
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashed-password"
      )
      expect(result.user).toEqual({
        id: "user-uuid-1",
        name: "John Doe",
        email: "john@example.com",
      })
      expect(result.accessToken).toBeDefined()
      expect(result.refreshToken).toBeDefined()
    })

    it("should throw 401 for non-existent user", async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(null)

      await expect(
        authService.authenticate({
          email: "nonexistent@example.com",
          password: "password123",
        })
      ).rejects.toThrow("Invalid email or password")
    })

    it("should throw 401 for wrong password", async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(
        authService.authenticate({
          email: "john@example.com",
          password: "wrong-password",
        })
      ).rejects.toThrow("Invalid email or password")
    })
  })

  describe("refresh", () => {
    it("should refresh tokens with a valid refresh token", async () => {
      const storedToken = {
        token: "valid-refresh-token",
        userId: "user-uuid-1",
        expiresAt: new Date(Date.now() + 86400000),
        destroy: jest.fn(),
      }
      ;(RefreshToken.findOne as jest.Mock).mockResolvedValue(storedToken)
      ;(User.findByPk as jest.Mock).mockResolvedValue(mockUser)
      ;(RefreshToken.create as jest.Mock).mockResolvedValue({})

      const result = await authService.refresh("valid-refresh-token")

      expect(storedToken.destroy).toHaveBeenCalled()
      expect(result.user).toEqual({
        id: "user-uuid-1",
        name: "John Doe",
        email: "john@example.com",
      })
      expect(result.accessToken).toBeDefined()
      expect(result.refreshToken).toBeDefined()
    })

    it("should throw 400 if no token provided", async () => {
      await expect(authService.refresh("")).rejects.toThrow(
        "Refresh token is required"
      )
    })

    it("should throw 401 for invalid refresh token", async () => {
      ;(RefreshToken.findOne as jest.Mock).mockResolvedValue(null)

      await expect(authService.refresh("invalid-token")).rejects.toThrow(
        "Invalid refresh token"
      )
    })

    it("should throw 401 for expired refresh token", async () => {
      const expiredToken = {
        token: "expired-token",
        userId: "user-uuid-1",
        expiresAt: new Date(Date.now() - 86400000),
        destroy: jest.fn(),
      }
      ;(RefreshToken.findOne as jest.Mock).mockResolvedValue(expiredToken)

      await expect(authService.refresh("expired-token")).rejects.toThrow(
        "Refresh token has expired"
      )
    })
  })

  describe("logout", () => {
    it("should destroy refresh token on logout", async () => {
      ;(RefreshToken.destroy as jest.Mock).mockResolvedValue(1)

      await expect(
        authService.logout("valid-refresh-token")
      ).resolves.toBeUndefined()

      expect(RefreshToken.destroy).toHaveBeenCalledWith({
        where: { token: "valid-refresh-token" },
      })
    })

    it("should throw 400 if no token provided", async () => {
      await expect(authService.logout("")).rejects.toThrow(
        "Refresh token is required"
      )
    })

    it("should throw 401 for invalid refresh token", async () => {
      ;(RefreshToken.destroy as jest.Mock).mockResolvedValue(0)

      await expect(authService.logout("invalid-token")).rejects.toThrow(
        "Invalid refresh token"
      )
    })
  })
})
