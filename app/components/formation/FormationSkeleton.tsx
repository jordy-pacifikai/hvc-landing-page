'use client'

function Bone({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-md ${className}`}
      style={{
        background: 'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
        backgroundSize: '800px 100%',
        animation: 'shimmer 1.8s ease-in-out infinite',
      }}
    />
  )
}

export function ModuleCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-[var(--color-slate)] bg-[var(--color-obsidian)]">
      <div className="flex items-start gap-4">
        <Bone className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1">
          <Bone className="h-5 w-3/4 mb-3" />
          <Bone className="h-3 w-full mb-2" />
          <Bone className="h-3 w-2/3 mb-4" />
          <Bone className="h-2 w-full" />
        </div>
      </div>
    </div>
  )
}

export function LessonPageSkeleton() {
  return (
    <div className="space-y-6">
      <Bone className="h-8 w-2/3" />
      <Bone className="w-full aspect-video rounded-xl" />
      <Bone className="h-4 w-full" />
      <Bone className="h-4 w-3/4" />
      <Bone className="h-10 w-48" />
    </div>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <Bone className="h-6 w-32" />
      <Bone className="h-8 w-full" />
      <Bone className="h-2 w-full" />
      {[...Array(6)].map((_, i) => (
        <Bone key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}
