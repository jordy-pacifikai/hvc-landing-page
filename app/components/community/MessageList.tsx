'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CornerDownRight } from 'lucide-react'
import { useMessages } from '@/app/lib/community-hooks'
import { useCommunityStore } from '@/app/lib/community-store'
import type { Message } from '@/app/lib/community-api'
import MessageReactions from './MessageReactions'

interface MessageListProps {
  channelSlug: string
  channelId: string
}

// --- Helpers ---

function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(date, today)) return "Aujourd'hui"
  if (isSameDay(date, yesterday)) return 'Hier'
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function isSameDay(a: string, b: string) {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

function isGrouped(prev: Message, curr: Message): boolean {
  if (!prev || prev.user_id !== curr.user_id) return false
  const diff = new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime()
  return diff < 5 * 60 * 1000 // 5 minutes
}

function getAvatarUrl(user: Message['user']): string | null {
  if (!user?.discord_avatar) return null
  const discordId = user.discord_id || user.id
  return `https://cdn.discordapp.com/avatars/${discordId}/${user.discord_avatar}.png?size=64`
}

// --- Skeleton ---

function MessageSkeleton() {
  return (
    <div className="flex gap-3">
      <div
        className="w-10 h-10 rounded-full shrink-0"
        style={{
          background: 'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
          backgroundSize: '800px 100%',
          animation: 'shimmer 1.8s ease-in-out infinite',
        }}
      />
      <div className="flex-1 space-y-2">
        <div
          className="h-4 w-28 rounded"
          style={{
            background: 'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
            backgroundSize: '800px 100%',
            animation: 'shimmer 1.8s ease-in-out infinite',
          }}
        />
        <div
          className="h-4 w-3/4 rounded"
          style={{
            background: 'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
            backgroundSize: '800px 100%',
            animation: 'shimmer 1.8s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  )
}

// --- DateSeparator ---

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 px-2">
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
      <span className="text-mist/50 text-xs font-medium shrink-0">{label}</span>
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
    </div>
  )
}

// --- MessageContent (markdown) ---

function MessageContent({ content }: { content: string }) {
  return (
    <div className="text-pearl text-sm break-words">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="whitespace-pre-wrap mb-0 last:mb-0">{children}</p>,
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
        strong: ({ children }) => <strong className="text-ivory font-semibold">{children}</strong>,
        em: ({ children }) => <em className="text-pearl/80 italic">{children}</em>,
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

// --- ReplyButton (hover action) ---

function ReplyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Repondre dans un fil"
      className="
        inline-flex items-center gap-1 px-2 py-1 rounded-md
        text-mist/40 hover:text-mist/80
        hover:bg-[rgba(255,255,255,0.06)]
        border border-transparent hover:border-[rgba(255,255,255,0.08)]
        transition-all duration-150 text-[10px] font-medium
        active:scale-95
      "
    >
      <CornerDownRight className="w-3 h-3" />
      <span>Repondre</span>
    </button>
  )
}

// --- ThreadIndicator (shown below messages with replies) ---

function ThreadIndicator({
  replyCount,
  onClick,
}: {
  replyCount: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        mt-1 inline-flex items-center gap-1.5
        text-mist/50 hover:text-champagne/80
        text-[11px] font-medium
        transition-colors duration-150
        group
      "
    >
      <CornerDownRight className="w-3 h-3 text-mist/40 group-hover:text-champagne/60 transition-colors" />
      <span>
        {replyCount} reponse{replyCount > 1 ? 's' : ''} &rsaquo;
      </span>
    </button>
  )
}

// --- MessageRow ---

interface MessageRowProps {
  msg: Message
  grouped: boolean
  replyCount?: number
}

function MessageRow({ msg, grouped, replyCount = 0 }: MessageRowProps) {
  const avatarUrl = getAvatarUrl(msg.user)
  const time = new Date(msg.created_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const [hovered, setHovered] = useState(false)
  const { setActiveThread } = useCommunityStore()

  const reactions = msg.reactions ?? []

  const handleReply = useCallback(() => {
    setActiveThread(msg.id)
  }, [msg.id, setActiveThread])

  if (grouped) {
    return (
      <div
        className="flex gap-3 py-0.5 px-2 rounded-md hover:bg-[rgba(255,255,255,0.02)] group relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Placeholder width to align with avatar */}
        <div className="w-10 shrink-0 flex items-center justify-center">
          <span className="text-mist/30 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity leading-none">
            {time}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <MessageContent content={msg.content} />
          {msg.pending && (
            <span className="text-mist/40 text-[10px] ml-1">envoi...</span>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <MessageReactions
              messageId={msg.id}
              reactions={reactions}
              showAddButton={hovered}
            />
            {hovered && !msg.pending && (
              <ReplyButton onClick={handleReply} />
            )}
          </div>
          {replyCount > 0 && (
            <ThreadIndicator replyCount={replyCount} onClick={handleReply} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex gap-3 py-1.5 px-2 rounded-md hover:bg-[rgba(255,255,255,0.02)] group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
        <div className="flex items-baseline gap-2">
          <span className="text-ivory font-medium text-sm">
            {msg.user?.discord_username || 'Unknown'}
          </span>
          {msg.user?.role && msg.user.role !== 'member' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(99,102,241,0.15)] text-gold-pale font-medium uppercase">
              {msg.user.role}
            </span>
          )}
          <span className="text-mist/50 text-xs">{time}</span>
          {msg.is_edited && (
            <span className="text-mist/30 text-[10px]">(modifie)</span>
          )}
        </div>
        <MessageContent content={msg.content} />
        {msg.pending && (
          <span className="text-mist/40 text-[10px]">envoi...</span>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <MessageReactions
            messageId={msg.id}
            reactions={reactions}
            showAddButton={hovered}
          />
          {hovered && !msg.pending && (
            <ReplyButton onClick={handleReply} />
          )}
        </div>
        {replyCount > 0 && (
          <ThreadIndicator replyCount={replyCount} onClick={handleReply} />
        )}
      </div>
    </div>
  )
}

// --- MessageList ---

export default function MessageList({ channelSlug }: MessageListProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(channelSlug)

  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const isNearBottomRef = useRef(true)

  // Flatten pages — newest last (pages are in reverse order from API cursor)
  const messages: Message[] = data?.pages
    ? [...data.pages].reverse().flatMap((p: { messages: Message[] }) => p.messages)
    : []

  // Build a reply count map: parentId -> count of replies
  // Only count top-level messages (reply_to !== null) that aren't themselves pending
  const replyCountMap = messages.reduce<Record<string, number>>((acc, msg) => {
    if (msg.reply_to && !msg.pending) {
      acc[msg.reply_to] = (acc[msg.reply_to] ?? 0) + 1
    }
    return acc
  }, {})

  // Track if user is near bottom
  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const threshold = 150
    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold
  }, [])

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!isLoading && messages.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'instant' })
    }
  }, [isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom when new messages arrive and user is near bottom
  const prevLengthRef = useRef(messages.length)
  useEffect(() => {
    if (messages.length > prevLengthRef.current && isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    prevLengthRef.current = messages.length
  }, [messages.length])

  // IntersectionObserver for infinite scroll (load older messages)
  useEffect(() => {
    const sentinel = topSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          // Save scroll position before loading
          const container = containerRef.current
          const scrollHeightBefore = container?.scrollHeight ?? 0

          fetchNextPage().then(() => {
            // Restore scroll position after new messages inserted at top
            if (container) {
              const added = container.scrollHeight - scrollHeightBefore
              container.scrollTop += added
            }
          })
        }
      },
      { root: containerRef.current, threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MessageSkeleton key={i} />
        ))}
      </div>
    )
  }

  // --- Empty state ---
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

  // --- Build render list: only top-level messages (no reply_to) ---
  // Replies are hidden from the main list — they live in ThreadPanel
  const topLevelMessages = messages.filter((m) => !m.reply_to)

  type RenderItem =
    | { type: 'separator'; key: string; label: string }
    | { type: 'message'; key: string; msg: Message; grouped: boolean }

  const items: RenderItem[] = []

  for (let i = 0; i < topLevelMessages.length; i++) {
    const msg = topLevelMessages[i]
    const prev = topLevelMessages[i - 1]

    // Date separator
    if (!prev || !isSameDay(prev.created_at, msg.created_at)) {
      items.push({
        type: 'separator',
        key: `sep-${msg.created_at}`,
        label: formatDateSeparator(msg.created_at),
      })
    }

    items.push({
      type: 'message',
      key: msg.id,
      msg,
      grouped: !!prev && isSameDay(prev.created_at, msg.created_at) && isGrouped(prev, msg),
    })
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-0"
    >
      {/* Top sentinel for infinite scroll */}
      <div ref={topSentinelRef} className="h-1" />

      {/* Load more indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-3">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-mist/40"
                style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {items.map((item) =>
        item.type === 'separator' ? (
          <DateSeparator key={item.key} label={item.label} />
        ) : (
          <MessageRow
            key={item.key}
            msg={item.msg}
            grouped={item.grouped}
            replyCount={replyCountMap[item.msg.id] ?? 0}
          />
        )
      )}

      {/* Bottom anchor for scroll */}
      <div ref={bottomRef} className="h-1" />
    </div>
  )
}
