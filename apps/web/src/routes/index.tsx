import { Routes, Route, Navigate } from "react-router-dom"
import { RootLayout } from "@/layouts/root-layout"
import { GuestRoute } from "@/routes/guest-route"
import { ProtectedRoute } from "@/routes/protected-route"
import LoginPage from "@/pages/login"
import SignupPage from "@/pages/signup"
import { DashboardPage } from "@/pages/dashboard"
import { NotFoundPage } from "@/pages/not-found"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/login" replace />} />

        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
