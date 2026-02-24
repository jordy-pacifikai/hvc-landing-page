'use client'

import { useCommunityStore } from '@/app/lib/community-store'

// Shimmer skeleton for a single member row
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

function OnlineDot() {
  return (
    <span className="relative flex-shrink-0">
      <span className="block w-2 h-2 rounded-full bg-green-500" />
      <span
        className="absolute inset-0 rounded-full bg-green-500 opacity-60"
        style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
      />
    </span>
  )
}

export default function MembersSidebar() {
  const onlineUsers = useCommunityStore((s) => s.onlineUsers)
  const onlineCount = onlineUsers.size

  // onlineUsers is a Set<string> of userIds — we show count only for this first version.
  // Full member list with avatars arrives with the /api/community/members endpoint.

  return (
    <div className="h-full overflow-y-auto py-4 space-y-5">
      {/* Online section */}
      <section>
        <h3 className="px-4 text-[10px] font-semibold text-mist/50 uppercase tracking-widest mb-2 flex items-center gap-2">
          <OnlineDot />
          En ligne
          <span className="ml-auto text-mist/40 font-normal normal-case tracking-normal text-[10px]">
            {onlineCount}
          </span>
        </h3>

        {onlineCount === 0 ? (
          <div className="px-4 py-1">
            <p className="text-mist/40 text-xs">Aucun membre en ligne</p>
          </div>
        ) : (
          <div className="space-y-0.5 px-2">
            {/* Skeleton rows representing online users by count */}
            {Array.from({ length: onlineCount }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-default group"
              >
                {/* Avatar placeholder — initials avatar until /members API */}
                <div className="relative shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-champagne/30 to-champagne/10 border border-champagne/20 flex items-center justify-center text-xs font-semibold text-champagne/80 select-none">
                    ?
                  </div>
                  {/* Online indicator dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[var(--color-obsidian)]" />
                </div>
                <span className="text-xs text-mist/60 group-hover:text-mist/80 transition-colors truncate">
                  Membre en ligne
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="mx-4 h-px bg-[rgba(255,255,255,0.05)]" />

      {/* Offline section — placeholder until /members API */}
      <section>
        <h3 className="px-4 text-[10px] font-semibold text-mist/30 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mist/25 shrink-0" />
          Hors ligne
        </h3>
        <div className="space-y-0.5 px-2">
          {/* Skeleton rows for offline members — shown as "loading" until /members API */}
          {Array.from({ length: 3 }).map((_, i) => (
            <MemberSkeleton key={i} />
          ))}
        </div>
        <p className="px-4 mt-3 text-[10px] text-mist/25 italic">
          Liste complète disponible prochainement
        </p>
      </section>
    </div>
  )
}
