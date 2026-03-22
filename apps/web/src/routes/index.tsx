import { Routes, Route } from "react-router-dom"
import { RootLayout } from "@/layouts/root-layout"
import { HomePage } from "@/pages/home"
import { NotFoundPage } from "@/pages/not-found"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
