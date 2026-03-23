import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { LoginForm } from "@/components/login-form"
import { renderWithProviders } from "./test-utils"

const mockLogin = vi.fn()

vi.mock("@/services/auth-service", () => ({
  login: (...args: unknown[]) => mockLogin(...args),
  signup: vi.fn(),
  getMe: vi.fn(),
  logoutApi: vi.fn(),
  refreshToken: vi.fn(),
}))

describe("LoginForm", () => {
  beforeEach(() => {
    mockLogin.mockReset()
  })

  it("renders the login form with all fields", () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByTestId("login-btn")).toBeInTheDocument()
  })

  it("renders social login buttons with data-testid", () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByTestId("login-apple-btn")).toBeInTheDocument()
    expect(screen.getByTestId("login-google-btn")).toBeInTheDocument()
  })

  it("has a link to sign up page", () => {
    renderWithProviders(<LoginForm />)

    const signupLink = screen.getByRole("link", { name: /sign up/i })
    expect(signupLink).toBeInTheDocument()
    expect(signupLink).toHaveAttribute("href", "/signup")
  })

  it("shows validation errors for empty fields on submit", async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.click(screen.getByTestId("login-btn"))

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it("submits the form with valid data", async () => {
    mockLogin.mockResolvedValue({
      message: "Login successful",
      user: { id: "1", name: "John", email: "john@example.com" },
      accessToken: "token",
      refreshToken: "refresh",
    })

    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), "john@example.com")
    await user.type(screen.getByLabelText(/password/i), "password123")
    await user.click(screen.getByTestId("login-btn"))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
      expect(mockLogin.mock.calls[0][0]).toEqual({
        email: "john@example.com",
        password: "password123",
      })
    })
  })

  it("disables the button while submitting", async () => {
    let resolveLogin: (value: unknown) => void
    mockLogin.mockImplementation(
      () => new Promise((resolve) => { resolveLogin = resolve })
    )

    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), "john@example.com")
    await user.type(screen.getByLabelText(/password/i), "password123")
    await user.click(screen.getByTestId("login-btn"))

    await waitFor(() => {
      expect(screen.getByTestId("login-btn")).toBeDisabled()
      expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    })

    resolveLogin!({
      message: "Login successful",
      user: { id: "1", name: "John", email: "john@example.com" },
      accessToken: "token",
      refreshToken: "refresh",
    })
  })

  it("login button has correct data-testid and type", () => {
    renderWithProviders(<LoginForm />)

    const loginBtn = screen.getByTestId("login-btn")
    expect(loginBtn).toBeInTheDocument()
    expect(loginBtn).toHaveAttribute("type", "submit")
  })
})
