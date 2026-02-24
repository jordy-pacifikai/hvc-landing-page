'use client'

import { useState, useEffect, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initPostHog } from './lib/posthog'
import AnalyticsScripts from './components/AnalyticsScripts'

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1 },
    },
  }))

  useEffect(() => {
    initPostHog()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsScripts />
      {children}
    </QueryClientProvider>
  )
}
