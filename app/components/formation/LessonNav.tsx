'use client'

import Link from 'next/link'
import type { Lesson } from '@/app/lib/lessons'

interface LessonNavProps {
  prev: Lesson | null
  next: Lesson | null
}

export default function LessonNav({ prev, next }: LessonNavProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-slate)]">
      {prev ? (
        <Link
          href={`/formation/${prev.moduleId}/${prev.id}`}
          className="flex items-center gap-2 text-sm text-[var(--color-mist)] hover:text-[var(--color-ivory)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="max-w-[200px] truncate">{prev.title}</span>
        </Link>
      ) : <div />}

      {next ? (
        <Link
          href={`/formation/${next.moduleId}/${next.id}`}
          className="flex items-center gap-2 text-sm text-[var(--color-mist)] hover:text-[var(--color-ivory)] transition-colors"
        >
          <span className="max-w-[200px] truncate">{next.title}</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : <div />}
    </div>
  )
}
