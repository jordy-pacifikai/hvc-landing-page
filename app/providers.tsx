'use client'

import { useEffect, ReactNode } from 'react'
import { initPostHog } from './lib/posthog'
import AnalyticsScripts from './components/AnalyticsScripts'

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    initPostHog()
  }, [])

  return (
    <>
      <AnalyticsScripts />
      {children}
    </>
  )
}
