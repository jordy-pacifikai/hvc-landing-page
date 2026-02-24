'use client'

import { use } from 'react'
import Link from 'next/link'
import { useSession, useQuiz, useQuizResults } from '@/app/lib/formation-hooks'
import { getModule } from '@/app/lib/lessons'
import QuizForm from '@/app/components/formation/QuizForm'
import PremiumTeaser from '@/app/components/formation/PremiumTeaser'

export default function QuizPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = use(params)
  const { data: session, isLoading: sessionLoading } = useSession()
  const { data: quizData, isLoading: quizLoading } = useQuiz(moduleId)
  const { data: quizResults } = useQuizResults()

  const module = getModule(moduleId)

  if (sessionLoading || quizLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl" style={{ background: 'var(--color-charcoal)', animation: 'shimmer 1.8s ease-in-out infinite', backgroundSize: '800px 100%', backgroundImage: 'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)' }} />
          ))}
        </div>
      </div>
    )
  }

  if (!session?.authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-[var(--color-mist)] mb-4">Connecte-toi pour acceder au quiz.</p>
        <a href="/api/auth/login" className="px-6 py-3 rounded-lg font-semibold text-white" style={{ background: 'linear-gradient(135deg, #5865F2, #7C3AED)' }}>
          Se connecter avec Discord
        </a>
      </div>
    )
  }

  if (!session.isPremium) return <PremiumTeaser />

  if (!module || !quizData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--color-mist)]">Quiz introuvable.</p>
        <Link href="/formation" className="text-[var(--color-gold-light)] mt-4 inline-block">Retour</Link>
      </div>
    )
  }

  const previousResult = (quizResults?.results || []).find(
    (r: { module_id: string }) => r.module_id === moduleId
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-mist)] mb-8">
        <Link href="/formation" className="hover:text-[var(--color-ivory)] transition-colors">Formation</Link>
        <span>/</span>
        <Link href={`/formation/${moduleId}`} className="hover:text-[var(--color-ivory)] transition-colors">{module.title}</Link>
        <span>/</span>
        <span className="text-[var(--color-pearl)]">Quiz</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--color-ivory)] mb-2">
          Quiz — {module.title}
        </h1>
        <p className="text-[var(--color-mist)]">
          {module.quizThreshold}% requis pour obtenir le role @{module.rewardRoleName} sur Discord.
          {quizData.questions.length} questions.
        </p>
      </div>

      <QuizForm
        moduleId={moduleId}
        moduleName={module.title}
        questions={quizData.questions}
        threshold={module.quizThreshold}
        previousScore={previousResult?.passed ? undefined : previousResult?.score}
      />
    </div>
  )
}
