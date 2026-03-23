import { Button } from "@workspace/ui/components/button"
import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <h1 className="text-6xl font-bold tracking-tight">404</h1>
        <p className="text-muted-foreground text-lg">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild data-testid="go-home-btn">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
