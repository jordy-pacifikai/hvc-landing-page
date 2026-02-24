'use client'

import Link from 'next/link'
import LessonCard from './LessonCard'
import ProgressBar from './ProgressBar'
import UserBadge from './UserBadge'
import { MODULES } from '@/app/lib/lessons'
import { useFormationStore } from '@/app/lib/formation-store'

interface FormationSidebarProps {
  completedLessons: Set<string>
  currentLessonId?: string
  session: {
    discordUsername: string
    discordAvatar: string | null
    isPremium: boolean
  }
}

export default function FormationSidebar({ completedLessons, currentLessonId, session }: FormationSidebarProps) {
  const { sidebarOpen, setSidebarOpen } = useFormationStore()
  const totalCompleted = completedLessons.size
  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0)
  const overallProgress = Math.round((totalCompleted / totalLessons) * 100)

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[var(--color-obsidian)] border-r border-[var(--color-slate)] z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-[var(--color-slate)]">
          <Link href="/formation" className="flex items-center gap-2 mb-4">
            <span className="text-lg font-display font-bold text-[var(--color-ivory)]">HVC Formation</span>
          </Link>
          <UserBadge
            username={session.discordUsername}
            avatar={session.discordAvatar}
            isPremium={session.isPremium}
          />
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-[var(--color-mist)] mb-1">
              <span>Progression globale</span>
              <span>{overallProgress}%</span>
            </div>
            <ProgressBar value={overallProgress} />
          </div>
        </div>

        <nav className="p-2">
          {MODULES.map((module) => {
            const moduleCompleted = module.lessons.filter(l => completedLessons.has(l.id)).length
            const moduleProgress = Math.round((moduleCompleted / module.lessons.length) * 100)

            return (
              <div key={module.id} className="mb-4">
                <Link href={`/formation/${module.id}`}>
                  <div className="flex items-center justify-between px-3 py-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-mist)]">
                      {module.title}
                    </span>
                    <span className="text-xs text-[var(--color-mist)]">{moduleProgress}%</span>
                  </div>
                </Link>
                <div className="space-y-0.5">
                  {module.lessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lessonId={lesson.id}
                      moduleId={module.id}
                      number={lesson.number}
                      title={lesson.title}
                      type={lesson.type}
                      isCompleted={completedLessons.has(lesson.id)}
                      isActive={lesson.id === currentLessonId}
                    />
                  ))}
                </div>
                {/* Quiz link */}
                <Link href={`/formation/quiz/${module.id}`}>
                  <div className="flex items-center gap-2 px-4 py-2 mt-1 text-sm text-[var(--color-gold-light)] hover:text-white transition-colors">
                    <span>📝</span>
                    <span>Quiz {module.title}</span>
                  </div>
                </Link>
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
