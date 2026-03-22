import { AppProviders } from "@/app/providers"
import { AppInitializer } from "@/app/app-initializer"
import { AppRoutes } from "@/routes"

export function App() {
  return (
    <AppProviders>
      <AppInitializer>
        <AppRoutes />
      </AppInitializer>
    </AppProviders>
  )
}
