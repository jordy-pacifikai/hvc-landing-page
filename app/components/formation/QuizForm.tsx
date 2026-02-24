'use client'

import { useState } from 'react'
import { useSubmitQuiz } from '@/app/lib/formation-hooks'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
}

interface QuizFormProps {
  moduleId: string
  moduleName: string
  questions: QuizQuestion[]
  threshold: number
  previousScore?: number
}

export default function QuizForm({ moduleId, moduleName, questions, threshold, previousScore }: QuizFormProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)
  const submitQuiz = useSubmitQuiz()

  const allAnswered = questions.every(q => answers[q.id] !== undefined)

  async function handleSubmit() {
    if (!allAnswered) return
    const res = await submitQuiz.mutateAsync({ moduleId, answers })
    setResult(res)
  }

  if (result) {
    return (
      <div className="text-center py-12">
        <div className={`text-6xl mb-4 ${result.passed ? '' : ''}`}>
          {result.passed ? '🎉' : '💪'}
        </div>
        <h2 className="text-2xl font-display font-bold text-[var(--color-ivory)] mb-2">
          {result.passed ? 'Felicitations !' : 'Pas encore...'}
        </h2>
        <p className="text-4xl font-bold mb-4" style={{ color: result.passed ? '#10b981' : '#ef4444' }}>
          {result.score}%
        </p>
        <p className="text-[var(--color-mist)] mb-6">
          {result.passed
            ? `Tu as reussi le quiz ${moduleName} ! Ton role Discord a ete mis a jour.`
            : `Il faut ${threshold}% pour valider. Revois les lecons et reessaie !`}
        </p>
        {!result.passed && (
          <button
            onClick={() => { setResult(null); setAnswers({}) }}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--color-champagne), var(--color-gold-light))' }}
          >
            Reessayer
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {previousScore !== undefined && (
        <div className="px-4 py-3 rounded-lg bg-[var(--color-slate)] text-sm text-[var(--color-mist)]">
          Derniere tentative : {previousScore}% — Il faut {threshold}% pour valider.
        </div>
      )}

      {questions.map((q, qIdx) => (
        <div key={q.id} className="p-6 rounded-xl bg-[var(--color-obsidian)] border border-[var(--color-slate)]">
          <p className="text-[var(--color-ivory)] font-medium mb-4">
            {qIdx + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, optIdx) => (
              <button
                key={optIdx}
                onClick={() => setAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                  answers[q.id] === optIdx
                    ? 'bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/50 text-white'
                    : 'bg-[var(--color-charcoal)] border border-transparent text-[var(--color-pearl)] hover:bg-[var(--color-slate)]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || submitQuiz.isPending}
        className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
        style={{ background: allAnswered ? 'linear-gradient(135deg, var(--color-champagne), var(--color-gold-light))' : 'var(--color-slate)' }}
      >
        {submitQuiz.isPending ? 'Validation...' : `Valider (${Object.keys(answers).length}/${questions.length})`}
      </button>
    </div>
  )
}
