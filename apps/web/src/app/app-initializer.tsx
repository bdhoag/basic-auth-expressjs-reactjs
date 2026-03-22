import type { ReactNode } from "react"
import { useAppSelector } from "@/app/store"
import { useMe } from "@/features/auth/auth-hooks"

export function AppInitializer({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const { isLoading } = useMe()

  if (isAuthenticated && isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    )
  }

  return children
}
