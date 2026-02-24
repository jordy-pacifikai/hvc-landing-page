'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, MessageSquare, FileText, Hash } from 'lucide-react'
import { useCommunityStore } from '@/app/lib/community-store'
import { useSearch } from '@/app/lib/community-hooks'
import type { Message, ForumPost } from '@/app/lib/community-api'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAvatarUrl(discordId: string, discordAvatar: string | null): string | null {
  if (!discordAvatar) return null
  return `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.webp?size=64`
}

function getInitial(username: string): string {
  return username?.charAt(0)?.toUpperCase() ?? '?'
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^\s*[-*>]\s+/gm, '')
    .trim()
}

function relativeDate(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return "a l'instant"
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`
  if (diff < 604800) return `il y a ${Math.floor(diff / 86400)} j`
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

function Avatar({
  discordId,
  discordAvatar,
  username,
  size = 32,
}: {
  discordId: string
  discordAvatar: string | null
  username: string
  size?: number
}) {
  const url = getAvatarUrl(discordId, discordAvatar)

  if (url) {
    return (
      <img
        src={url}
        alt={username}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement
          target.style.display = 'none'
          const fallback = target.nextElementSibling as HTMLElement | null
          if (fallback) fallback.style.display = 'flex'
        }}
      />
    )
  }

  return (
    <div
      className="rounded-full bg-[var(--color-slate)] flex items-center justify-center shrink-0 text-champagne font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitial(username)}
    </div>
  )
}

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────

const shimmerStyle = {
  background:
    'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
  backgroundSize: '800px 100%',
  animation: 'shimmer 1.8s ease-in-out infinite',
} as const

function ResultSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-full shrink-0" style={shimmerStyle} />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="h-3.5 w-32 rounded" style={shimmerStyle} />
        <div className="h-3 w-full rounded" style={shimmerStyle} />
        <div className="h-3 w-2/3 rounded" style={shimmerStyle} />
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="py-2">
      <div className="px-4 pb-2 pt-3">
        <div className="h-3 w-20 rounded" style={shimmerStyle} />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <ResultSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── Result Items ─────────────────────────────────────────────────────────────

function MessageResultItem({
  message,
  channels,
  isActive,
  onClick,
}: {
  message: Message
  channels: Array<{ id: string; name: string; slug: string }>
  isActive: boolean
  onClick: () => void
}) {
  const channel = channels.find((c) => c.id === message.channel_id)
  const preview = message.content.slice(0, 120) + (message.content.length > 120 ? '…' : '')
  const username = message.user?.discord_username ?? 'Inconnu'

  return (
    <button
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-150 ${
        isActive ? 'bg-[rgba(255,255,255,0.08)]' : 'hover:bg-[rgba(255,255,255,0.04)]'
      }`}
      onClick={onClick}
    >
      <Avatar
        discordId={message.user?.discord_id ?? ''}
        discordAvatar={message.user?.discord_avatar ?? null}
        username={username}
        size={32}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-ivory text-xs font-medium truncate">{username}</span>
          {channel && (
            <span className="flex items-center gap-0.5 text-mist/60 text-xs shrink-0">
              <Hash className="w-3 h-3" />
              {channel.name}
            </span>
          )}
          <span className="text-mist/40 text-xs shrink-0 ml-auto">{relativeDate(message.created_at)}</span>
        </div>
        <p className="text-mist text-xs leading-relaxed line-clamp-2">{preview}</p>
      </div>
    </button>
  )
}

function ForumPostResultItem({
  post,
  isActive,
  onClick,
}: {
  post: ForumPost
  isActive: boolean
  onClick: () => void
}) {
  const preview = stripMarkdown(post.content).slice(0, 120) + (post.content.length > 120 ? '…' : '')
  const username = post.user?.discord_username ?? 'Inconnu'

  return (
    <button
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-150 ${
        isActive ? 'bg-[rgba(255,255,255,0.08)]' : 'hover:bg-[rgba(255,255,255,0.04)]'
      }`}
      onClick={onClick}
    >
      <Avatar
        discordId={post.user?.discord_id ?? ''}
        discordAvatar={post.user?.discord_avatar ?? null}
        username={username}
        size={32}
      />
      <div className="flex-1 min-w-0">
        <p className="text-ivory text-xs font-semibold truncate mb-0.5">{post.title}</p>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-mist/60 text-xs">{username}</span>
          <span className="text-mist/40 text-xs">{relativeDate(post.created_at)}</span>
          {typeof post.comment_count === 'number' && (
            <span className="text-mist/40 text-xs ml-auto flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {post.comment_count}
            </span>
          )}
        </div>
        <p className="text-mist text-xs leading-relaxed line-clamp-2">{preview}</p>
      </div>
    </button>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, label, count }: { icon: React.ElementType; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 mt-2">
      <Icon className="w-3.5 h-3.5 text-champagne/70" />
      <span className="text-champagne/70 text-xs font-semibold uppercase tracking-wider">{label}</span>
      <span className="text-mist/40 text-xs">({count})</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SearchModal() {
  const searchOpen = useCommunityStore((s) => s.searchOpen)
  const setSearchOpen = useCommunityStore((s) => s.setSearchOpen)
  const channels = useCommunityStore((s) => s.channels)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const [inputValue, setInputValue] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  // Debounce input → query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1)
  }, [debouncedQuery])

  // Auto-focus input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setInputValue('')
      setDebouncedQuery('')
      setActiveIndex(-1)
    }
  }, [searchOpen])

  // Escape to close
  useEffect(() => {
    if (!searchOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [searchOpen, setSearchOpen])

  // TanStack Query search
  const { data, isFetching } = useSearch(debouncedQuery)
  const messages: Message[] = data?.messages ?? []
  const posts: ForumPost[] = data?.posts ?? []

  // Flat list of navigable items for keyboard nav
  const flatItems: Array<{ type: 'message'; item: Message } | { type: 'post'; item: ForumPost }> = [
    ...messages.map((m) => ({ type: 'message' as const, item: m })),
    ...posts.map((p) => ({ type: 'post' as const, item: p })),
  ]

  const navigate = useCallback(
    (entry: (typeof flatItems)[number]) => {
      setSearchOpen(false)
      if (entry.type === 'message') {
        const channel = channels.find((c) => c.id === entry.item.channel_id)
        if (channel) router.push(`/community/${channel.slug}`)
      } else {
        router.push(`/community/forum/${entry.item.id}`)
      }
    },
    [channels, router, setSearchOpen]
  )

  // Keyboard navigation inside results
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (flatItems.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault()
        navigate(flatItems[activeIndex])
      }
    },
    [flatItems, activeIndex, navigate]
  )

  if (!searchOpen) return null

  const showLoading = isFetching && debouncedQuery.length >= 2
  const showEmpty = debouncedQuery.length < 2
  const showNoResults = !isFetching && debouncedQuery.length >= 2 && messages.length === 0 && posts.length === 0
  const showResults = !isFetching && (messages.length > 0 || posts.length > 0)

  // Map channel objects for message items
  const channelList = channels.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setSearchOpen(false)
      }}
    >
      <div
        className="w-full max-w-xl bg-[var(--color-obsidian)] border border-[rgba(99,102,241,0.12)] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '70vh' }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(99,102,241,0.08)]">
          <Search className="w-4 h-4 text-mist/60 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher des messages et posts..."
            className="flex-1 bg-transparent text-ivory text-sm placeholder:text-mist/40 outline-none"
            autoComplete="off"
          />
          {inputValue && (
            <button
              onClick={() => {
                setInputValue('')
                inputRef.current?.focus()
              }}
              className="text-mist/50 hover:text-mist transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.08)] text-mist/40 text-xs font-mono">
            esc
          </kbd>
        </div>

        {/* Results area */}
        <div ref={listRef} className="overflow-y-auto flex-1">

          {/* Empty state */}
          {showEmpty && (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-center px-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-charcoal)] flex items-center justify-center">
                <Search className="w-5 h-5 text-mist/40" />
              </div>
              <div>
                <p className="text-pearl text-sm font-medium mb-1">Recherche dans la communaute</p>
                <p className="text-mist/50 text-xs">
                  Tape au moins 2 caracteres pour rechercher dans les messages et le forum.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <kbd className="px-2 py-0.5 rounded border border-[rgba(255,255,255,0.08)] text-mist/40 text-xs font-mono bg-[var(--color-charcoal)]">
                  ⌘K
                </kbd>
                <span className="text-mist/30 text-xs">pour ouvrir / fermer</span>
              </div>
            </div>
          )}

          {/* Loading skeletons */}
          {showLoading && <LoadingState />}

          {/* No results */}
          {showNoResults && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-8">
              <p className="text-pearl text-sm">Aucun resultat pour &ldquo;{debouncedQuery}&rdquo;</p>
              <p className="text-mist/40 text-xs">Essaie un autre mot-cle.</p>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="pb-3">
              {messages.length > 0 && (
                <div>
                  <SectionHeader icon={MessageSquare} label="Messages" count={messages.length} />
                  {messages.map((msg, i) => (
                    <MessageResultItem
                      key={msg.id}
                      message={msg}
                      channels={channelList}
                      isActive={activeIndex === i}
                      onClick={() => navigate({ type: 'message', item: msg })}
                    />
                  ))}
                </div>
              )}

              {posts.length > 0 && (
                <div>
                  <SectionHeader
                    icon={FileText}
                    label="Posts du forum"
                    count={posts.length}
                  />
                  {posts.map((post, i) => (
                    <ForumPostResultItem
                      key={post.id}
                      post={post}
                      isActive={activeIndex === messages.length + i}
                      onClick={() => navigate({ type: 'post', item: post })}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        {flatItems.length > 0 && (
          <div className="px-4 py-2 border-t border-[rgba(99,102,241,0.06)] flex items-center gap-4">
            <span className="text-mist/30 text-xs flex items-center gap-1">
              <kbd className="font-mono">↑↓</kbd> naviguer
            </span>
            <span className="text-mist/30 text-xs flex items-center gap-1">
              <kbd className="font-mono">↵</kbd> ouvrir
            </span>
            <span className="text-mist/30 text-xs flex items-center gap-1">
              <kbd className="font-mono">esc</kbd> fermer
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
