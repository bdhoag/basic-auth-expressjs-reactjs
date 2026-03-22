import { Button } from "@workspace/ui/components/button"

export function HomePage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome</h1>
        <p className="text-muted-foreground text-lg">
          Your project is ready. Start building something great.
        </p>
        <Button size="lg">Get Started</Button>
      </div>
    </div>
  )
}
