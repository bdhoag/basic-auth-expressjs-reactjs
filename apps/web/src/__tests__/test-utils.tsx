import type { ReactNode } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router-dom"
import authReducer from "@/features/auth/auth-slice"

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
  preloadedState?: Record<string, unknown>
  route?: string
}

function createTestStore(preloadedState?: Record<string, unknown>) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  })
}

function AllProviders({
  children,
  preloadedState,
  route = "/",
}: {
  children: ReactNode
  preloadedState?: Record<string, unknown>
  route?: string
}) {
  const store = createTestStore(preloadedState)
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  )
}

function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState, route, ...renderOptions }: CustomRenderOptions = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders preloadedState={preloadedState} route={route}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  })
}

export { renderWithProviders }
