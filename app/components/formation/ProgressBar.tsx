'use client'

export default function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-2 rounded-full bg-[var(--color-slate)] overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: 'linear-gradient(90deg, var(--color-champagne), var(--color-gold-light))',
        }}
      />
    </div>
  )
}
