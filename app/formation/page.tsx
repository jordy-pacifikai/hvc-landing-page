'use client'

import { useSession, useProgress, useQuizResults } from '@/app/lib/formation-hooks'
import { MODULES, TOTAL_LESSONS } from '@/app/lib/lessons'
import LoginButton from '@/app/components/formation/LoginButton'
import ModuleCard from '@/app/components/formation/ModuleCard'
import ProgressBar from '@/app/components/formation/ProgressBar'
import PremiumTeaser from '@/app/components/formation/PremiumTeaser'
import UserBadge from '@/app/components/formation/UserBadge'
import { ModuleCardSkeleton } from '@/app/components/formation/FormationSkeleton'
import Link from 'next/link'

export default function FormationPage() {
  const { data: session, isLoading: sessionLoading } = useSession()
  const { data: progressData, isLoading: progressLoading } = useProgress()
  const { data: quizData } = useQuizResults()

  // Loading state — skeleton
  if (sessionLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 w-64 rounded-md mb-8" style={{ background: 'var(--color-charcoal)', animation: 'shimmer 1.8s ease-in-out infinite', backgroundSize: '800px 100%', backgroundImage: 'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)' }} />
        <div className="grid gap-6">
          {[0, 1, 2].map(i => <ModuleCardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  // Not logged in
  if (!session?.authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <Link href="/" className="mb-8">
          <span className="text-2xl font-display font-bold text-[var(--color-ivory)]">High Value Capital</span>
        </Link>
        <h1 className="text-4xl font-display font-bold text-[var(--color-ivory)] mb-4">
          Formation Trading
        </h1>
        <p className="text-lg text-[var(--color-mist)] max-w-md mb-8">
          42 lecons video pour maitriser le Forex avec la methodologie ARD.
          Connecte-toi avec Discord pour acceder a ta formation.
        </p>
        <LoginButton />
        <p className="text-sm text-[var(--color-mist)] mt-6">
          Pas encore membre ?{' '}
          <a href="/checkout" className="underline hover:text-[var(--color-ivory)]">
            Devenir Premium
          </a>
        </p>
      </div>
    )
  }

  // Not premium
  if (!session.isPremium) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <span className="text-xl font-display font-bold text-[var(--color-ivory)]">HVC</span>
          </Link>
          <UserBadge
            username={session.discordUsername}
            avatar={session.discordAvatar}
            isPremium={false}
          />
        </div>
        <PremiumTeaser />
      </div>
    )
  }

  // Premium user — show modules
  const completedLessons = new Set<string>(
    (progressData?.progress || []).map((p: { lesson_id: string }) => p.lesson_id)
  )
  const quizResults = quizData?.results || []
  const totalCompleted = completedLessons.size
  const overallProgress = Math.round((totalCompleted / TOTAL_LESSONS) * 100)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <span className="text-xl font-display font-bold text-[var(--color-ivory)]">HVC</span>
        </Link>
        <UserBadge
          username={session.discordUsername}
          avatar={session.discordAvatar}
          isPremium={true}
        />
      </div>

      {/* Title + Progress */}
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-[var(--color-ivory)] mb-2">
          Ta Formation
        </h1>
        <p className="text-[var(--color-mist)] mb-4">
          {totalCompleted}/{TOTAL_LESSONS} lecons completees
        </p>
        <ProgressBar value={overallProgress} className="h-3" />
      </div>

      {/* Module Cards */}
      {progressLoading ? (
        <div className="grid gap-6">
          {[0, 1, 2].map(i => <ModuleCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid gap-6">
          {MODULES.map((module, index) => {
            const moduleCompleted = module.lessons.filter(l => completedLessons.has(l.id)).length
            const quizResult = quizResults.find((r: { module_id: string }) => r.module_id === module.id)

            return (
              <ModuleCard
                key={module.id}
                module={module}
                completedCount={moduleCompleted}
                quizPassed={quizResult?.passed || false}
                index={index}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
