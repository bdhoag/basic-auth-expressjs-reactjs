import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { SignupForm } from "@/components/signup-form"
import { renderWithProviders } from "./test-utils"

const mockSignup = vi.fn()

vi.mock("@/services/auth-service", () => ({
  login: vi.fn(),
  signup: (...args: unknown[]) => mockSignup(...args),
  getMe: vi.fn(),
  logoutApi: vi.fn(),
  refreshToken: vi.fn(),
}))

describe("SignupForm", () => {
  beforeEach(() => {
    mockSignup.mockReset()
  })

  it("renders the signup form with all fields", () => {
    renderWithProviders(<SignupForm />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByTestId("create-btn")).toBeInTheDocument()
  })

  it("renders social signup buttons with data-testid", () => {
    renderWithProviders(<SignupForm />)

    expect(screen.getByTestId("signup-apple-btn")).toBeInTheDocument()
    expect(screen.getByTestId("signup-google-btn")).toBeInTheDocument()
  })

  it("has a link to sign in page", () => {
    renderWithProviders(<SignupForm />)

    const signinLink = screen.getByRole("link", { name: /sign in/i })
    expect(signinLink).toBeInTheDocument()
    expect(signinLink).toHaveAttribute("href", "/login")
  })

  it("shows validation errors for empty fields on submit", async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignupForm />)

    await user.click(screen.getByTestId("create-btn"))

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it("shows validation error for short password", async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignupForm />)

    await user.type(screen.getByLabelText(/name/i), "John Doe")
    await user.type(screen.getByLabelText(/email/i), "john@example.com")
    await user.type(screen.getByLabelText(/password/i), "12345")
    await user.click(screen.getByTestId("create-btn"))

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 6 characters/i)
      ).toBeInTheDocument()
    })
  })

  it("submits the form with valid data", async () => {
    mockSignup.mockResolvedValue({
      message: "User created successfully",
      user: { id: "1", name: "John Doe", email: "john@example.com" },
      accessToken: "token",
      refreshToken: "refresh",
    })

    const user = userEvent.setup()
    renderWithProviders(<SignupForm />)

    await user.type(screen.getByLabelText(/name/i), "John Doe")
    await user.type(screen.getByLabelText(/email/i), "john@example.com")
    await user.type(screen.getByLabelText(/password/i), "password123")
    await user.click(screen.getByTestId("create-btn"))

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled()
      expect(mockSignup.mock.calls[0][0]).toEqual({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      })
    })
  })

  it("disables the button while submitting", async () => {
    let resolveSignup: (value: unknown) => void
    mockSignup.mockImplementation(
      () => new Promise((resolve) => { resolveSignup = resolve })
    )

    const user = userEvent.setup()
    renderWithProviders(<SignupForm />)

    await user.type(screen.getByLabelText(/name/i), "John")
    await user.type(screen.getByLabelText(/email/i), "john@example.com")
    await user.type(screen.getByLabelText(/password/i), "password123")
    await user.click(screen.getByTestId("create-btn"))

    await waitFor(() => {
      expect(screen.getByTestId("create-btn")).toBeDisabled()
      expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    })

    resolveSignup!({
      message: "User created successfully",
      user: { id: "1", name: "John", email: "john@example.com" },
      accessToken: "token",
      refreshToken: "refresh",
    })
  })

  it("create button has correct data-testid and type", () => {
    renderWithProviders(<SignupForm />)

    const createBtn = screen.getByTestId("create-btn")
    expect(createBtn).toBeInTheDocument()
    expect(createBtn).toHaveAttribute("type", "submit")
  })
})
