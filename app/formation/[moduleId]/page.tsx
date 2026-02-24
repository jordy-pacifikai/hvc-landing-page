'use client'

import { use } from 'react'
import Link from 'next/link'
import { useSession, useProgress, useQuizResults } from '@/app/lib/formation-hooks'
import { getModule, MODULES } from '@/app/lib/lessons'
import LessonCard from '@/app/components/formation/LessonCard'
import ProgressBar from '@/app/components/formation/ProgressBar'
import UserBadge from '@/app/components/formation/UserBadge'
import PremiumTeaser from '@/app/components/formation/PremiumTeaser'
import { ModuleCardSkeleton } from '@/app/components/formation/FormationSkeleton'

export default function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = use(params)
  const { data: session, isLoading: sessionLoading } = useSession()
  const { data: progressData } = useProgress()
  const { data: quizData } = useQuizResults()

  const module = getModule(moduleId)

  if (sessionLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ModuleCardSkeleton />
      </div>
    )
  }

  if (!session?.authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-[var(--color-mist)] mb-4">Connecte-toi pour acceder a la formation.</p>
        <a href="/api/auth/login" className="px-6 py-3 rounded-lg font-semibold text-white" style={{ background: 'linear-gradient(135deg, #5865F2, #7C3AED)' }}>
          Se connecter avec Discord
        </a>
      </div>
    )
  }

  if (!session.isPremium) return <PremiumTeaser />

  if (!module) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--color-mist)]">Module introuvable.</p>
        <Link href="/formation" className="text-[var(--color-gold-light)] mt-4 inline-block">Retour</Link>
      </div>
    )
  }

  const completedLessons = new Set<string>(
    (progressData?.progress || []).map((p: { lesson_id: string }) => p.lesson_id)
  )
  const moduleCompleted = module.lessons.filter(l => completedLessons.has(l.id)).length
  const progress = Math.round((moduleCompleted / module.lessons.length) * 100)
  const quizResult = (quizData?.results || []).find((r: { module_id: string }) => r.module_id === moduleId)

  // Find module index for prev/next navigation
  const moduleIndex = MODULES.findIndex(m => m.id === moduleId)
  const prevModule = moduleIndex > 0 ? MODULES[moduleIndex - 1] : null
  const nextModule = moduleIndex < MODULES.length - 1 ? MODULES[moduleIndex + 1] : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/formation" className="flex items-center gap-2 text-[var(--color-mist)] hover:text-[var(--color-ivory)] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Link>
        <UserBadge
          username={session.discordUsername}
          avatar={session.discordAvatar}
          isPremium={true}
        />
      </div>

      {/* Module Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--color-ivory)] mb-2">
          {module.title}
        </h1>
        <p className="text-[var(--color-mist)] mb-4">{module.description}</p>
        <div className="flex items-center gap-3">
          <ProgressBar value={progress} className="flex-1 h-2.5" />
          <span className="text-sm text-[var(--color-mist)]">{moduleCompleted}/{module.lessons.length}</span>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-1 mb-8">
        {module.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lessonId={lesson.id}
            moduleId={module.id}
            number={lesson.number}
            title={lesson.title}
            type={lesson.type}
            isCompleted={completedLessons.has(lesson.id)}
          />
        ))}
      </div>

      {/* Quiz CTA */}
      <div className="p-6 rounded-2xl border border-[var(--color-slate)] bg-[var(--color-obsidian)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-semibold text-[var(--color-ivory)] mb-1">
              Quiz — {module.title}
            </h3>
            <p className="text-sm text-[var(--color-mist)]">
              {quizResult?.passed
                ? `Valide avec ${quizResult.score}% ! Role @${module.rewardRoleName} obtenu.`
                : `${module.quizThreshold}% requis pour obtenir le role @${module.rewardRoleName}`}
            </p>
          </div>
          <Link
            href={`/formation/quiz/${module.id}`}
            className="px-5 py-2.5 rounded-lg font-semibold text-white text-sm transition-all hover:scale-105"
            style={{ background: quizResult?.passed ? '#10b981' : 'linear-gradient(135deg, var(--color-champagne), var(--color-gold-light))' }}
          >
            {quizResult?.passed ? 'Revoir' : 'Passer le quiz'}
          </Link>
        </div>
      </div>

      {/* Module Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-slate)]">
        {prevModule ? (
          <Link href={`/formation/${prevModule.id}`} className="text-sm text-[var(--color-mist)] hover:text-[var(--color-ivory)] transition-colors">
            ← {prevModule.title}
          </Link>
        ) : <div />}
        {nextModule ? (
          <Link href={`/formation/${nextModule.id}`} className="text-sm text-[var(--color-mist)] hover:text-[var(--color-ivory)] transition-colors">
            {nextModule.title} →
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
