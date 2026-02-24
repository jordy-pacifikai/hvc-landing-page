'use client'

import { useMessages } from '@/app/lib/community-hooks'
import type { Message } from '@/app/lib/community-api'

interface MessageListProps {
  channelSlug: string
  channelId: string
}

export default function MessageList({ channelSlug, channelId }: MessageListProps) {
  const { data, isLoading } = useMessages(channelSlug)

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 rounded-full shrink-0" style={{
              background: 'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
              backgroundSize: '800px 100%',
              animation: 'shimmer 1.8s ease-in-out infinite',
            }} />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-28 rounded" style={{
                background: 'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
                backgroundSize: '800px 100%',
                animation: 'shimmer 1.8s ease-in-out infinite',
              }} />
              <div className="h-4 w-3/4 rounded" style={{
                background: 'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
                backgroundSize: '800px 100%',
                animation: 'shimmer 1.8s ease-in-out infinite',
              }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const messages: Message[] = data?.pages?.flatMap((p: { messages: Message[] }) => p.messages) || []

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl">💬</div>
          <p className="text-mist">Aucun message pour l&apos;instant.</p>
          <p className="text-mist/60 text-sm">Sois le premier a ecrire !</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1 flex flex-col-reverse">
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-3 py-1.5 px-2 rounded-md hover:bg-[rgba(255,255,255,0.02)] group">
          {msg.user?.discord_avatar ? (
            <img
              src={`https://cdn.discordapp.com/avatars/${msg.user.id}/${msg.user.discord_avatar}.png?size=64`}
              alt=""
              className="w-10 h-10 rounded-full shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-void text-sm font-bold shrink-0">
              {msg.user?.discord_username?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-ivory font-medium text-sm">
                {msg.user?.discord_username || 'Unknown'}
              </span>
              {msg.user?.role && msg.user.role !== 'member' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(99,102,241,0.15)] text-gold-pale font-medium uppercase">
                  {msg.user.role}
                </span>
              )}
              <span className="text-mist/50 text-xs">
                {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-pearl text-sm whitespace-pre-wrap break-words">{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
