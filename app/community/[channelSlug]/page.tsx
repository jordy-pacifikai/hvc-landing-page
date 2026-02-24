'use client'

import { use, useEffect } from 'react'
import { useCommunityStore } from '@/app/lib/community-store'
import MessageList from '@/app/components/community/MessageList'
import MessageInput from '@/app/components/community/MessageInput'
import ForumPostList from '@/app/components/community/ForumPostList'
import TypingIndicator from '@/app/components/community/TypingIndicator'
import ThreadPanel from '@/app/components/community/ThreadPanel'
import { useSession } from '@/app/lib/formation-hooks'
import { useCommunityRealtime } from '@/app/lib/community-realtime'
import { useMarkChannelRead } from '@/app/lib/community-hooks'

export default function ChannelPage({ params }: { params: Promise<{ channelSlug: string }> }) {
  const { channelSlug } = use(params)
  const channels = useCommunityStore((s) => s.channels)
  const setActiveChannel = useCommunityStore((s) => s.setActiveChannel)
  const activeThread = useCommunityStore((s) => s.activeThread)
  const setActiveThread = useCommunityStore((s) => s.setActiveThread)
  const { data: session } = useSession()
  const channel = channels.find((c) => c.slug === channelSlug)
  const { mutate: markRead } = useMarkChannelRead()

  // Subscribe to realtime messages for this channel
  const { status: realtimeStatus } = useCommunityRealtime(channel?.id ?? null)

  useEffect(() => {
    setActiveChannel(channelSlug)
  }, [channelSlug, setActiveChannel])

  // Close thread when switching channels
  useEffect(() => {
    setActiveThread(null)
  }, [channelSlug, setActiveThread])

  // Auto mark-as-read when the user opens a channel
  useEffect(() => {
    if (channel && session?.authenticated) {
      markRead(channelSlug)
    }
  }, [channelSlug, channel, session?.authenticated, markRead])

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-mist">Chargement du channel...</div>
      </div>
    )
  }

  if (channel.channel_type === 'forum') {
    return <ForumPostList channelSlug={channelSlug} channel={channel} />
  }

  return (
    <div className="flex h-full min-h-0">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Realtime connection banner — only show when actually disconnected (not on initial connect) */}
        {realtimeStatus === 'disconnected' && (
          <div className="flex items-center justify-between px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-400/90 shrink-0">
            <span>Connexion temps reel perdue — les nouveaux messages s&apos;actualisent toutes les 5s</span>
          </div>
        )}
        <MessageList channelSlug={channelSlug} channelId={channel.id} />
        <TypingIndicator channelId={channel.id} />
        {!channel.is_readonly && session?.authenticated && (
          <MessageInput channelId={channel.id} channelSlug={channelSlug} />
        )}
        {channel.is_readonly && (
          <div className="px-4 py-3 bg-[var(--color-obsidian)] border-t border-[rgba(99,102,241,0.08)] text-center text-mist text-sm">
            Ce channel est en lecture seule.
          </div>
        )}
      </div>

      {/* Thread panel — slides in from right when a message thread is opened */}
      {activeThread && (
        <ThreadPanel
          messageId={activeThread}
          channelId={channel.id}
          channelSlug={channelSlug}
          onClose={() => setActiveThread(null)}
        />
      )}
    </div>
  )
}
