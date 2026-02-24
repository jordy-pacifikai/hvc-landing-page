'use client'

import Link from 'next/link'
import ProgressBar from './ProgressBar'
import type { Module } from '@/app/lib/lessons'

interface ModuleCardProps {
  module: Module
  completedCount: number
  quizPassed: boolean
  index: number
}

const moduleIcons = ['📚', '📈', '🧠']

export default function ModuleCard({ module, completedCount, quizPassed, index }: ModuleCardProps) {
  const progress = Math.round((completedCount / module.lessons.length) * 100)

  return (
    <Link href={`/formation/${module.id}`}>
      <div className="group relative p-6 rounded-2xl border border-[var(--color-slate)] bg-[var(--color-obsidian)] hover:border-[var(--color-gold)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-gold)]/5 cursor-pointer">
        <div className="flex items-start gap-4">
          <span className="text-3xl">{moduleIcons[index]}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-display font-semibold text-[var(--color-ivory)] group-hover:text-white transition-colors">
                {module.title}
              </h3>
              {quizPassed && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                  Valide
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--color-mist)] mb-4 line-clamp-2">
              {module.description}
            </p>
            <div className="flex items-center gap-3">
              <ProgressBar value={progress} className="flex-1" />
              <span className="text-xs text-[var(--color-mist)] whitespace-nowrap">
                {completedCount}/{module.lessons.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
