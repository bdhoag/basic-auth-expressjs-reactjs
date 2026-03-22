import request from "supertest"
import app from "../app"
import * as authService from "../services/auth.service"

jest.mock("../services/auth.service")

const mockAuthResult = {
  user: { id: "user-uuid-1", name: "John Doe", email: "john@example.com" },
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
}

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /auth/signup", () => {
    it("should return 201 with user and tokens on successful signup", async () => {
      ;(authService.register as jest.Mock).mockResolvedValue(mockAuthResult)

      const res = await request(app).post("/auth/signup").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      })

      expect(res.status).toBe(201)
      expect(res.body.message).toBe("User created successfully")
      expect(res.body.user).toEqual(mockAuthResult.user)
      expect(res.body.accessToken).toBe("mock-access-token")
      expect(res.body.refreshToken).toBe("mock-refresh-token")
    })

    it("should return 400 if name is missing", async () => {
      const res = await request(app).post("/auth/signup").send({
        email: "john@example.com",
        password: "password123",
      })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe("Name, email, and password are required")
    })

    it("should return 400 if email is missing", async () => {
      const res = await request(app).post("/auth/signup").send({
        name: "John Doe",
        password: "password123",
      })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe("Name, email, and password are required")
    })

    it("should return 400 if password is too short", async () => {
      const res = await request(app).post("/auth/signup").send({
        name: "John Doe",
        email: "john@example.com",
        password: "12345",
      })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe(
        "Password must be at least 6 characters"
      )
    })

    it("should return 409 if email already exists", async () => {
      const error: Error & { statusCode?: number } = new Error(
        "Email already in use"
      )
      error.statusCode = 409
      ;(authService.register as jest.Mock).mockRejectedValue(error)

      const res = await request(app).post("/auth/signup").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      })

      expect(res.status).toBe(409)
      expect(res.body.message).toBe("Email already in use")
    })
  })

  describe("POST /auth/login", () => {
    it("should return 200 with user and tokens on successful login", async () => {
      ;(authService.authenticate as jest.Mock).mockResolvedValue(mockAuthResult)

      const res = await request(app).post("/auth/login").send({
        email: "john@example.com",
        password: "password123",
      })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe("Login successful")
      expect(res.body.user).toEqual(mockAuthResult.user)
      expect(res.body.accessToken).toBe("mock-access-token")
    })

    it("should return 400 if email is missing", async () => {
      const res = await request(app).post("/auth/login").send({
        password: "password123",
      })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe("Email and password are required")
    })

    it("should return 400 if password is missing", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "john@example.com",
      })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe("Email and password are required")
    })

    it("should return 401 for invalid credentials", async () => {
      const error: Error & { statusCode?: number } = new Error(
        "Invalid email or password"
      )
      error.statusCode = 401
      ;(authService.authenticate as jest.Mock).mockRejectedValue(error)

      const res = await request(app).post("/auth/login").send({
        email: "john@example.com",
        password: "wrong-password",
      })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe("Invalid email or password")
    })
  })

  describe("POST /auth/refresh", () => {
    it("should return 200 with new tokens on valid refresh", async () => {
      ;(authService.refresh as jest.Mock).mockResolvedValue(mockAuthResult)

      const res = await request(app).post("/auth/refresh").send({
        refreshToken: "valid-refresh-token",
      })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe("Token refreshed")
      expect(res.body.accessToken).toBeDefined()
      expect(res.body.refreshToken).toBeDefined()
    })

    it("should return error for invalid refresh token", async () => {
      const error: Error & { statusCode?: number } = new Error(
        "Invalid refresh token"
      )
      error.statusCode = 401
      ;(authService.refresh as jest.Mock).mockRejectedValue(error)

      const res = await request(app).post("/auth/refresh").send({
        refreshToken: "invalid-token",
      })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe("Invalid refresh token")
    })
  })

  describe("POST /auth/logout", () => {
    it("should return 200 on successful logout", async () => {
      ;(authService.logout as jest.Mock).mockResolvedValue(undefined)

      const res = await request(app).post("/auth/logout").send({
        refreshToken: "valid-refresh-token",
      })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe("Logged out successfully")
    })

    it("should return error for invalid token", async () => {
      const error: Error & { statusCode?: number } = new Error(
        "Invalid refresh token"
      )
      error.statusCode = 401
      ;(authService.logout as jest.Mock).mockRejectedValue(error)

      const res = await request(app).post("/auth/logout").send({
        refreshToken: "invalid-token",
      })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe("Invalid refresh token")
    })
  })
})
