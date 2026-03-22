import { AppProviders } from "@/app/providers"
import { AppInitializer } from "@/app/app-initializer"
import { AppRoutes } from "@/routes"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

export function App() {
  return (
    <TooltipProvider>
      <AppProviders>
        <AppInitializer>
          <AppRoutes />
        </AppInitializer>
      </AppProviders>
    </TooltipProvider>
  )
}
