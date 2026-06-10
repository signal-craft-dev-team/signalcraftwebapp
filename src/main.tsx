import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { mockScenario } from '@/lib/mockScenario'
import { applyClientTheme } from '@/lib/theme'

applyClientTheme(import.meta.env.VITE_CLIENT_THEME_ID || mockScenario.company.themeId)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      gcTime: 1000 * 60 * 60, // 1 hour
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Register Service Worker for PWA
if (process.env.NODE_ENV === 'production' || import.meta.env.DEV) {
  registerSW({ immediate: true })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
