import type { ReactNode } from "react"
import { useAppSelector } from "@/app/store"
import { useMe } from "@/features/auth/authHooks"

export function AppInitializer({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const { isLoading } = useMe()

  if (isAuthenticated && isLoading) {
    return (
      <div className="bg-background text-foreground flex min-h-svh items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary size-6 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  return children
}
