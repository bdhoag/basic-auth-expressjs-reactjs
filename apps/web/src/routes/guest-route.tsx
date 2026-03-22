import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "@/app/store"

export function GuestRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
