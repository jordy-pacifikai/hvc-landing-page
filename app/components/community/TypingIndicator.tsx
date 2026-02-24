'use client'

import { useCommunityStore } from '@/app/lib/community-store'

export default function TypingIndicator({ channelId }: { channelId: string }) {
  const typingUsers = useCommunityStore((s) => s.typingUsers[channelId] || [])

  if (typingUsers.length === 0) return null

  const names = typingUsers.map((u) => u.username)
  let text = ''
  if (names.length === 1) {
    text = `${names[0]} ecrit...`
  } else if (names.length === 2) {
    text = `${names[0]} et ${names[1]} ecrivent...`
  } else {
    text = `${names.length} personnes ecrivent...`
  }

  return (
    <div className="px-4 py-1 text-xs text-mist flex items-center gap-2">
      <div className="flex gap-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-mist/60 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-mist/60 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-mist/60 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{text}</span>
    </div>
  )
}
