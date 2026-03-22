import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { LogOut } from "lucide-react"
import { useAppSelector } from "@/app/store"
import { useLogout } from "@/features/auth/authHooks"

export function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user)
  const { mutate: logout, isPending: isLoggingOut } = useLogout()

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription>Welcome back, {user?.name}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Name</span>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Email</span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">User ID</span>
              <span className="text-sm font-medium font-mono">
                {user?.id}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => logout()}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 size-4" />
            {isLoggingOut ? "Signing out…" : "Sign Out"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
