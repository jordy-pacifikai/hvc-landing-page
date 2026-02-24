'use client'

import { logout } from '@/app/lib/formation-api'

interface UserBadgeProps {
  username: string
  avatar: string | null
  isPremium: boolean
}

export default function UserBadge({ username, avatar, isPremium }: UserBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      {avatar ? (
        <img src={avatar} alt={username} className="w-8 h-8 rounded-full" width={32} height={32} />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[var(--color-gold)] flex items-center justify-center text-sm font-bold text-white">
          {username[0]?.toUpperCase()}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[var(--color-ivory)]">{username}</span>
        {isPremium && (
          <span className="text-xs" style={{ color: 'var(--color-gold-light)' }}>Premium</span>
        )}
      </div>
      <button
        onClick={logout}
        className="ml-2 text-xs text-[var(--color-mist)] hover:text-[var(--color-ivory)] transition-colors"
      >
        Deconnexion
      </button>
    </div>
  )
}
