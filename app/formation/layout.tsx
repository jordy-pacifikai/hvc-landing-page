import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Formation | High Value Capital',
  description: 'Accede a la formation complete : Les Bases, High Value Concept, G-Mindset. 42 lecons video pour devenir un trader rentable.',
}

export default function FormationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-void)]">
      {children}
    </div>
  )
}
