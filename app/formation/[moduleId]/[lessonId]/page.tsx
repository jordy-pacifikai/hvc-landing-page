'use client'

import { use } from 'react'
import Link from 'next/link'
import { useSession, useProgress, useMarkComplete } from '@/app/lib/formation-hooks'
import { getLesson, getModule, getAdjacentLessons } from '@/app/lib/lessons'
import VideoPlayer from '@/app/components/formation/VideoPlayer'
import LessonNav from '@/app/components/formation/LessonNav'
import FormationSidebar from '@/app/components/formation/FormationSidebar'
import PremiumTeaser from '@/app/components/formation/PremiumTeaser'
import { LessonPageSkeleton } from '@/app/components/formation/FormationSkeleton'
import { useFormationStore } from '@/app/lib/formation-store'

export default function LessonPage({ params }: { params: Promise<{ moduleId: string; lessonId: string }> }) {
  const { moduleId, lessonId } = use(params)
  const { data: session, isLoading: sessionLoading } = useSession()
  const { data: progressData } = useProgress()
  const markComplete = useMarkComplete()
  const { toggleSidebar } = useFormationStore()

  const lesson = getLesson(lessonId)
  const module = getModule(moduleId)
  const { prev, next } = getAdjacentLessons(lessonId)

  if (sessionLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LessonPageSkeleton />
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

  if (!lesson || !module) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--color-mist)]">Lecon introuvable.</p>
        <Link href="/formation" className="text-[var(--color-gold-light)] mt-4 inline-block">Retour</Link>
      </div>
    )
  }

  const completedLessons = new Set<string>(
    (progressData?.progress || []).map((p: { lesson_id: string }) => p.lesson_id)
  )
  const isCompleted = completedLessons.has(lessonId)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <FormationSidebar
        completedLessons={completedLessons}
        currentLessonId={lessonId}
        session={session}
      />

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-[var(--color-void)]/80 backdrop-blur-sm border-b border-[var(--color-slate)] lg:hidden">
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-[var(--color-slate)]">
            <svg className="w-5 h-5 text-[var(--color-ivory)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm text-[var(--color-mist)] truncate">{module.title}</span>
        </div>

        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[var(--color-mist)] mb-6">
            <Link href="/formation" className="hover:text-[var(--color-ivory)] transition-colors">Formation</Link>
            <span>/</span>
            <Link href={`/formation/${moduleId}`} className="hover:text-[var(--color-ivory)] transition-colors">{module.title}</Link>
            <span>/</span>
            <span className="text-[var(--color-pearl)]">{lesson.title}</span>
          </div>

          {/* Lesson Title */}
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--color-ivory)] mb-2">
            {String(lesson.number).padStart(2, '0')} — {lesson.title}
          </h1>
          <p className="text-[var(--color-mist)] mb-8">{lesson.description}</p>

          {/* Video or Text Content */}
          {lesson.type === 'video' && lesson.videoUrl ? (
            <VideoPlayer url={lesson.videoUrl} />
          ) : (
            <div className="p-8 rounded-xl bg-[var(--color-obsidian)] border border-[var(--color-slate)]">
              <p className="text-[var(--color-pearl)] text-lg leading-relaxed">
                {lesson.description}
              </p>
            </div>
          )}

          {/* Mark Complete Button */}
          <div className="mt-8 flex items-center gap-4">
            {isCompleted ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-500/10 text-emerald-400 font-medium">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Lecon terminee
              </div>
            ) : (
              <button
                onClick={() => markComplete.mutate(lessonId)}
                disabled={markComplete.isPending}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, var(--color-champagne), var(--color-gold-light))' }}
              >
                {markComplete.isPending ? 'Enregistrement...' : 'Marquer comme terminee'}
              </button>
            )}
          </div>

          {/* Previous / Next */}
          <LessonNav prev={prev} next={next} />
        </div>
      </main>
    </div>
  )
}
