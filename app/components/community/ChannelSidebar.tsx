'use client'

import Link from 'next/link'
import { useCommunityStore } from '@/app/lib/community-store'
import ChannelCategory from './ChannelCategory'
import { useSession } from '@/app/lib/formation-hooks'

const CATEGORY_ORDER = ['accueil', 'communaute', 'formation', 'trading', 'premium', 'outils', 'lifestyle', 'admin']
const CATEGORY_LABELS: Record<string, string> = {
  accueil: 'Accueil',
  communaute: 'Communaute',
  formation: 'Formation',
  trading: 'Trading',
  premium: 'Premium',
  outils: 'Outils',
  lifestyle: 'Lifestyle',
  admin: 'Administration',
}

export default function ChannelSidebar() {
  const channels = useCommunityStore((s) => s.channels)
  const { data: session } = useSession()

  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof channels>>((acc, cat) => {
    const filtered = channels.filter((c) => c.category === cat)
    if (cat === 'admin' && session?.role !== 'admin' && session?.role !== 'moderator') {
      acc[cat] = filtered.filter(c => c.slug === 'suggestions' || c.slug === 'rapports-bugs')
    } else if (cat === 'premium' && !session?.isPremium) {
      acc[cat] = []
    } else {
      acc[cat] = filtered
    }
    return acc
  }, {})

  return (
    <>
      <div className="p-4 border-b border-[rgba(99,102,241,0.08)]">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-ivory">HVC</span>
          <span className="text-xs text-mist bg-[var(--color-slate)] px-2 py-0.5 rounded-full">Community</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        {CATEGORY_ORDER.map((cat) => {
          const catChannels = grouped[cat]
          if (!catChannels || catChannels.length === 0) return null
          return (
            <ChannelCategory
              key={cat}
              label={CATEGORY_LABELS[cat]}
              channels={catChannels}
            />
          )
        })}
      </div>

      {session?.authenticated && (
        <div className="p-3 border-t border-[rgba(99,102,241,0.08)] flex items-center gap-3">
          {session.discordAvatar ? (
            <img
              src={`https://cdn.discordapp.com/avatars/${session.discordId}/${session.discordAvatar}.png?size=64`}
              alt=""
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-void text-sm font-bold">
              {session.discordUsername?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-ivory text-sm font-medium truncate">{session.discordUsername}</div>
            <div className="text-mist text-xs">
              {session.isPremium ? 'Premium' : 'Membre'}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
