'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, CornerDownRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useQueryClient } from '@tanstack/react-query'
import { useCommunityStore } from '@/app/lib/community-store'
import { useSendMessage } from '@/app/lib/community-hooks'
import { useSession } from '@/app/lib/formation-hooks'
import type { Message } from '@/app/lib/community-api'

// --- Types ---

interface ThreadPanelProps {
  messageId: string
  channelId: string
  channelSlug: string
  onClose: () => void
}

type InfiniteData = {
  pages: { messages: Message[]; hasMore: boolean }[]
  pageParams: unknown[]
}

type SessionData = {
  authenticated: boolean
  userId?: string
  discordId?: string
  discordUsername?: string
  discordAvatar?: string | null
  isPremium?: boolean
}

// --- Helpers ---

function getAvatarUrl(user: Message['user']): string | null {
  if (!user?.discord_avatar) return null
  const discordId = user.discord_id || user.id
  return `https://cdn.discordapp.com/avatars/${discordId}/${user.discord_avatar}.png?size=64`
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const isSameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()

  if (isSameDay) return "Aujourd'hui"

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (isYesterday) return 'Hier'
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

// --- Skeleton ---

function ThreadMessageSkeleton() {
  return (
    <div className="flex gap-2.5 px-4 py-2">
      <div
        className="w-8 h-8 rounded-full shrink-0"
        style={{
          background:
            'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
          backgroundSize: '400px 100%',
          animation: 'shimmer 1.8s ease-in-out infinite',
        }}
      />
      <div className="flex-1 space-y-1.5">
        <div
          className="h-3 w-20 rounded"
          style={{
            background:
              'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
            backgroundSize: '400px 100%',
            animation: 'shimmer 1.8s ease-in-out infinite',
          }}
        />
        <div
          className="h-3 w-3/4 rounded"
          style={{
            background:
              'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
            backgroundSize: '400px 100%',
            animation: 'shimmer 1.8s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  )
}

// --- MessageContent (reusable markdown) ---

function MessageContent({ content }: { content: string }) {
  return (
    <div className="text-pearl text-sm break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="whitespace-pre-wrap mb-0 last:mb-0">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-champagne underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="text-ivory font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-pearl/80 italic">{children}</em>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-')
            if (isBlock) {
              return (
                <pre className="bg-[var(--color-void)] border border-[rgba(255,255,255,0.06)] rounded-md p-3 my-2 overflow-x-auto">
                  <code className="text-xs text-pearl font-mono">{children}</code>
                </pre>
              )
            }
            return (
              <code className="bg-[var(--color-void)] text-champagne font-mono text-xs px-1.5 py-0.5 rounded">
                {children}
              </code>
            )
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// --- ParentMessage (displayed at top of thread) ---

function ParentMessage({ msg }: { msg: Message }) {
  const avatarUrl = getAvatarUrl(msg.user)
  const time = formatTime(msg.created_at)
  const date = formatDate(msg.created_at)

  return (
    <div className="px-4 py-4 border-b border-[rgba(99,102,241,0.08)]">
      <div className="flex gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full shrink-0 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-void text-sm font-bold shrink-0">
            {msg.user?.discord_username?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-ivory font-medium text-sm">
              {msg.user?.discord_username || 'Unknown'}
            </span>
            {msg.user?.role && msg.user.role !== 'member' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(99,102,241,0.15)] text-gold-pale font-medium uppercase">
                {msg.user.role}
              </span>
            )}
            <span className="text-mist/40 text-xs">
              {date} {time}
            </span>
          </div>
          <MessageContent content={msg.content} />
        </div>
      </div>
    </div>
  )
}

// --- ThreadReplyRow (compact message row for replies) ---

function ThreadReplyRow({ msg }: { msg: Message }) {
  const avatarUrl = getAvatarUrl(msg.user)
  const time = formatTime(msg.created_at)

  return (
    <div className="flex gap-2.5 px-4 py-1.5 rounded-md hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 rounded-full shrink-0 object-cover mt-0.5"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-void text-xs font-bold shrink-0 mt-0.5">
          {msg.user?.discord_username?.[0]?.toUpperCase() || '?'}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-ivory font-medium text-xs">
            {msg.user?.discord_username || 'Unknown'}
          </span>
          {msg.user?.role && msg.user.role !== 'member' && (
            <span className="text-[9px] px-1 py-0.5 rounded-full bg-[rgba(99,102,241,0.15)] text-gold-pale font-medium uppercase">
              {msg.user.role}
            </span>
          )}
          <span className="text-mist/40 text-[10px]">{time}</span>
          {msg.is_edited && (
            <span className="text-mist/30 text-[10px]">(modifie)</span>
          )}
        </div>
        <MessageContent content={msg.content} />
        {msg.pending && (
          <span className="text-mist/40 text-[10px]">envoi...</span>
        )}
      </div>
    </div>
  )
}

// --- ThreadInput ---

function ThreadInput({
  channelId,
  channelSlug,
  parentMessageId,
}: {
  channelId: string
  channelSlug: string
  parentMessageId: string
}) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const queryClient = useQueryClient()
  const { mutate: send, isPending } = useSendMessage()
  const { data: session } = useSession() as { data: SessionData | null }

  const handleSend = useCallback(() => {
    const trimmed = content.trim()
    if (!trimmed || isPending) return

    setContent('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Optimistic reply
    const tempId = `pending-reply-${Date.now()}`
    const optimisticMsg: Message = {
      id: tempId,
      channel_id: channelId,
      user_id: session?.userId ?? 'me',
      content: trimmed,
      image_url: null,
      is_edited: false,
      reply_to: parentMessageId,
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

    // Inject into the channel messages cache
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

    send(
      { channelId, content: trimmed, replyTo: parentMessageId },
      {
        onSuccess: (serverMsg: Message) => {
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
  }, [content, isPending, send, channelId, channelSlug, parentMessageId, queryClient, session])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  if (!session?.authenticated) return null

  return (
    <div className="px-3 pb-3 pt-2 border-t border-[rgba(99,102,241,0.08)]">
      <div className="flex items-end gap-2 bg-[var(--color-charcoal)] rounded-lg border border-[rgba(99,102,241,0.1)] focus-within:border-[rgba(99,102,241,0.3)] transition-colors">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Repondre dans ce fil..."
          rows={1}
          className="flex-1 bg-transparent text-ivory placeholder-mist/50 text-sm px-3 py-2.5 resize-none outline-none max-h-[120px]"
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || isPending}
          className={`
            p-2.5 rounded-lg transition-all mr-1 mb-1
            ${
              content.trim()
                ? 'text-champagne hover:bg-[rgba(59,130,246,0.1)]'
                : 'text-mist/30 cursor-not-allowed'
            }
          `}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// --- ThreadPanel ---

export default function ThreadPanel({
  messageId,
  channelId,
  channelSlug,
  onClose,
}: ThreadPanelProps) {
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false)
  const repliesEndRef = useRef<HTMLDivElement>(null)

  // Animate in on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Get all messages from cache and filter
  const allMessages = (() => {
    const data = queryClient.getQueryData<InfiniteData>([
      'community',
      'messages',
      channelSlug,
    ])
    if (!data) return []
    return [...data.pages]
      .reverse()
      .flatMap((p: { messages: Message[] }) => p.messages)
  })()

  // Force re-render when cache changes
  const [, forceUpdate] = useState(0)
  useEffect(() => {
    const unsub = queryClient.getQueryCache().subscribe(() => forceUpdate((n) => n + 1))
    return unsub
  }, [queryClient])

  const parentMessage = allMessages.find((m) => m.id === messageId)
  const replies = allMessages
    .filter((m) => m.reply_to === messageId)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

  // Scroll to bottom of replies when new reply added
  const prevReplyCountRef = useRef(replies.length)
  useEffect(() => {
    if (replies.length > prevReplyCountRef.current) {
      repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    prevReplyCountRef.current = replies.length
  }, [replies.length])

  return (
    <>
      {/* Backdrop overlay on mobile */}
      <div
        className={`
          fixed inset-0 z-30 bg-black/40 lg:hidden
          transition-opacity duration-300
          ${mounted ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`
          fixed right-0 top-0 bottom-0 z-40
          w-full lg:w-[400px] lg:relative lg:z-auto lg:top-auto lg:bottom-auto
          flex flex-col
          bg-[var(--color-obsidian)]
          border-l border-[rgba(99,102,241,0.08)]
          shadow-2xl
          transition-transform duration-300 ease-out
          ${mounted ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(99,102,241,0.08)] shrink-0">
          <div className="flex items-center gap-2">
            <CornerDownRight className="w-4 h-4 text-mist/60" />
            <span className="text-ivory font-medium text-sm">Fil de discussion</span>
            {replies.length > 0 && (
              <span className="text-mist/50 text-xs">
                {replies.length} reponse{replies.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-mist/50 hover:text-ivory hover:bg-[rgba(255,255,255,0.06)] transition-all"
            aria-label="Fermer le fil"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Parent message */}
          {!parentMessage ? (
            <div className="px-4 py-4 border-b border-[rgba(99,102,241,0.08)]">
              <ThreadMessageSkeleton />
            </div>
          ) : (
            <ParentMessage msg={parentMessage} />
          )}

          {/* Replies section */}
          <div className="py-2">
            {replies.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-mist/50 text-sm">Aucune reponse pour l&apos;instant.</p>
                <p className="text-mist/30 text-xs mt-1">Sois le premier a repondre !</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 px-4 py-2 mb-1">
                  <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]" />
                  <span className="text-mist/30 text-[10px] font-medium shrink-0">
                    {replies.length} reponse{replies.length > 1 ? 's' : ''}
                  </span>
                  <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]" />
                </div>
                {replies.map((reply) => (
                  <ThreadReplyRow key={reply.id} msg={reply} />
                ))}
                <div ref={repliesEndRef} className="h-1" />
              </>
            )}
          </div>
        </div>

        {/* Reply input */}
        <ThreadInput
          channelId={channelId}
          channelSlug={channelSlug}
          parentMessageId={messageId}
        />
      </div>
    </>
  )
}
