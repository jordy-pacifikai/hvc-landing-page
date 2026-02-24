'use client'

import { useState, useRef, useCallback } from 'react'
import { Send } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useSendMessage } from '@/app/lib/community-hooks'
import { useSession } from '@/app/lib/formation-hooks'
import type { Message } from '@/app/lib/community-api'

interface MessageInputProps {
  channelId: string
  channelSlug: string
}

// Phase 2b — typing broadcast stub (Supabase Realtime)
// function useTypingBroadcast(channelId: string) {
//   const supabase = useSupabaseClient()
//   const broadcastTyping = useCallback(() => {
//     supabase.channel(`typing:${channelId}`).send({
//       type: 'broadcast',
//       event: 'typing',
//       payload: {},
//     })
//   }, [supabase, channelId])
//   return { broadcastTyping }
// }

type SessionData = {
  authenticated: boolean
  userId?: string
  discordId?: string
  discordUsername?: string
  discordAvatar?: string | null
  isPremium?: boolean
}

type InfiniteData = {
  pages: { messages: Message[]; hasMore: boolean }[]
  pageParams: unknown[]
}

export default function MessageInput({ channelId, channelSlug }: MessageInputProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const queryClient = useQueryClient()
  const { mutate: send, isPending } = useSendMessage()
  const { data: session } = useSession() as { data: SessionData | null }

  const handleSend = useCallback(() => {
    const trimmed = content.trim()
    if (!trimmed || isPending) return

    // Clear input immediately for better UX
    setContent('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // --- Optimistic update ---
    const tempId = `pending-${Date.now()}`
    const optimisticMsg: Message = {
      id: tempId,
      channel_id: channelId,
      user_id: session?.userId ?? 'me',
      content: trimmed,
      image_url: null,
      is_edited: false,
      reply_to: null,
      created_at: new Date().toISOString(),
      pending: true,
      user: {
        id: session?.userId ?? 'me',
        discord_id: session?.discordId ?? '',
        discord_username: session?.discordUsername ?? 'Vous',
        discord_avatar: session?.discordAvatar ?? null,
        role: 'member',
        is_premium: session?.isPremium ?? false,
      },
    }

    // Inject at the start of the first page (newest messages first in page[0])
    queryClient.setQueryData<InfiniteData>(
      ['community', 'messages', channelSlug],
      (old) => {
        if (!old) return old
        const pages = old.pages.map((page, i) => {
          if (i !== 0) return page
          return { ...page, messages: [optimisticMsg, ...page.messages] }
        })
        return { ...old, pages }
      }
    )

    // --- Send to server ---
    send(
      { channelId, content: trimmed },
      {
        onSuccess: (serverMsg: Message) => {
          // Replace optimistic message with real server response
          queryClient.setQueryData<InfiniteData>(
            ['community', 'messages', channelSlug],
            (old) => {
              if (!old) return old
              const pages = old.pages.map((page) => ({
                ...page,
                messages: page.messages.map((m) =>
                  m.id === tempId ? { ...serverMsg, pending: false } : m
                ),
              }))
              return { ...old, pages }
            }
          )
        },
        onError: () => {
          // Remove optimistic message on error, restore content
          queryClient.setQueryData<InfiniteData>(
            ['community', 'messages', channelSlug],
            (old) => {
              if (!old) return old
              const pages = old.pages.map((page) => ({
                ...page,
                messages: page.messages.filter((m) => m.id !== tempId),
              }))
              return { ...old, pages }
            }
          )
          setContent(trimmed)
        },
      }
    )
  }, [content, isPending, send, channelId, channelSlug, queryClient, session])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }

  if (!session?.authenticated) return null

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="flex items-end gap-2 bg-[var(--color-charcoal)] rounded-lg border border-[rgba(99,102,241,0.1)] focus-within:border-[rgba(99,102,241,0.3)] transition-colors">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Envoyer un message..."
          rows={1}
          className="flex-1 bg-transparent text-ivory placeholder-mist/50 text-sm px-4 py-3 resize-none outline-none max-h-[200px]"
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || isPending}
          className={`
            p-3 rounded-lg transition-all mr-1 mb-1
            ${content.trim()
              ? 'text-champagne hover:bg-[rgba(59,130,246,0.1)]'
              : 'text-mist/30 cursor-not-allowed'
            }
          `}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
