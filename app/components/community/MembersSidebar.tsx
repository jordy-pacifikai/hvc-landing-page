'use client'

import { useMemo } from 'react'
import { useMembers } from '@/app/lib/community-hooks'
import { useCommunityStore } from '@/app/lib/community-store'
import type { Member } from '@/app/lib/community-api'

function MemberSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div
        className="w-7 h-7 rounded-full shrink-0"
        style={{
          background:
            'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
          backgroundSize: '400px 100%',
          animation: 'shimmer 1.8s ease-in-out infinite',
        }}
      />
      <div
        className="h-3 w-24 rounded"
        style={{
          background:
            'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
          backgroundSize: '400px 100%',
          animation: 'shimmer 1.8s ease-in-out infinite',
        }}
      />
    </div>
  )
}

function getAvatarUrl(member: Member): string | null {
  if (!member.discord_avatar) return null
  return `https://cdn.discordapp.com/avatars/${member.id}/${member.discord_avatar}.png?size=64`
}

function MemberRow({ member, isOnline }: { member: Member; isOnline: boolean }) {
  const avatarUrl = getAvatarUrl(member)

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-default group">
      <div className="relative shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            width={28}
            height={28}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-champagne/30 to-champagne/10 border border-champagne/20 flex items-center justify-center text-xs font-semibold text-champagne/80 select-none">
            {member.discord_username?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[var(--color-obsidian)]" />
        )}
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`text-xs truncate ${isOnline ? 'text-mist/80 group-hover:text-ivory' : 'text-mist/40 group-hover:text-mist/60'} transition-colors`}>
          {member.discord_username}
        </span>
        {member.role && member.role !== 'member' && (
          <span className="text-[8px] px-1 py-0.5 rounded-full bg-[rgba(99,102,241,0.15)] text-gold-pale font-medium uppercase shrink-0">
            {member.role}
          </span>
        )}
      </div>
    </div>
  )
}

export default function MembersSidebar() {
  const { data: members, isLoading } = useMembers()
  const onlineUserIds = useCommunityStore((s) => s.onlineUsers)

  const onlineSet = useMemo(() => new Set(onlineUserIds), [onlineUserIds])

  const { online, offline } = useMemo(() => {
    if (!members) return { online: [], offline: [] }
    const on: Member[] = []
    const off: Member[] = []
    for (const m of members) {
      if (onlineSet.has(m.id)) on.push(m)
      else off.push(m)
    }
    return { online: on, offline: off }
  }, [members, onlineSet])

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto py-4 space-y-5">
        <section>
          <h3 className="px-4 text-[10px] font-semibold text-mist/50 uppercase tracking-widest mb-2">
            Membres
          </h3>
          <div className="space-y-0.5 px-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <MemberSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto py-4 space-y-5">
      {/* Online section */}
      <section>
        <h3 className="px-4 text-[10px] font-semibold text-mist/50 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="relative flex-shrink-0">
            <span className="block w-2 h-2 rounded-full bg-green-500" />
          </span>
          En ligne
          <span className="ml-auto text-mist/40 font-normal normal-case tracking-normal text-[10px]">
            {online.length}
          </span>
        </h3>

        {online.length === 0 ? (
          <div className="px-4 py-1">
            <p className="text-mist/40 text-xs">Aucun membre en ligne</p>
          </div>
        ) : (
          <div className="space-y-0.5 px-2">
            {online.map((m) => (
              <MemberRow key={m.id} member={m} isOnline />
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="mx-4 h-px bg-[rgba(255,255,255,0.05)]" />

      {/* Offline section */}
      <section>
        <h3 className="px-4 text-[10px] font-semibold text-mist/30 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mist/25 shrink-0" />
          Hors ligne
          <span className="ml-auto text-mist/30 font-normal normal-case tracking-normal text-[10px]">
            {offline.length}
          </span>
        </h3>
        {offline.length === 0 ? (
          <div className="px-4 py-1">
            <p className="text-mist/25 text-xs">Tous les membres sont en ligne</p>
          </div>
        ) : (
          <div className="space-y-0.5 px-2">
            {offline.map((m) => (
              <MemberRow key={m.id} member={m} isOnline={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
