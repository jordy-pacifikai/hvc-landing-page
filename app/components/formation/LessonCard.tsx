'use client'

import Link from 'next/link'

interface LessonCardProps {
  lessonId: string
  moduleId: string
  number: number
  title: string
  type: 'video' | 'text'
  isCompleted: boolean
  isActive?: boolean
}

export default function LessonCard({ lessonId, moduleId, number, title, type, isCompleted, isActive }: LessonCardProps) {
  return (
    <Link href={`/formation/${moduleId}/${lessonId}`}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
          isActive
            ? 'bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30'
            : 'hover:bg-[var(--color-slate)]/50'
        }`}
      >
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            isCompleted
              ? 'bg-emerald-500 text-white'
              : 'bg-[var(--color-slate)] text-[var(--color-mist)]'
          }`}
        >
          {isCompleted ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            String(number).padStart(2, '0')
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm truncate ${isActive ? 'text-white font-medium' : 'text-[var(--color-pearl)]'}`}>
            {title}
          </p>
        </div>
        <span className="text-xs text-[var(--color-mist)]">
          {type === 'video' ? '▶' : '📄'}
        </span>
      </div>
    </Link>
  )
}
