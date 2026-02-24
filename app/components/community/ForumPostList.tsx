'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Pin, MessageSquare, Eye, Plus } from 'lucide-react'
import { useForumPosts } from '@/app/lib/community-hooks'
import type { ForumPost } from '@/app/lib/community-api'
import ForumEditor from './ForumEditor'

interface ForumPostListProps {
  channelSlug: string
  channel: {
    id: string
    name: string
    icon: string | null
  }
}

// --- Helpers ---

function getAvatarUrl(user: ForumPost['user']): string | null {
  if (!user?.discord_avatar) return null
  const discordId = user.discord_id || user.id
  return `https://cdn.discordapp.com/avatars/${discordId}/${user.discord_avatar}.png?size=64`
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffH = Math.floor(diffMin / 60)
  const diffD = Math.floor(diffH / 24)

  if (diffMin < 1) return "a l'instant"
  if (diffMin < 60) return `il y a ${diffMin}min`
  if (diffH < 24) return `il y a ${diffH}h`
  if (diffD < 7) return `il y a ${diffD}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// --- Skeleton ---

function ForumPostSkeleton() {
  const shimmerStyle = {
    background:
      'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
    backgroundSize: '800px 100%',
    animation: 'shimmer 1.8s ease-in-out infinite',
  }

  return (
    <div className="bg-[var(--color-charcoal)] border border-[rgba(99,102,241,0.08)] rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full shrink-0" style={shimmerStyle} />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 w-3/4 rounded" style={shimmerStyle} />
          <div className="h-3 w-1/2 rounded" style={shimmerStyle} />
          <div className="flex gap-3 mt-3">
            <div className="h-3 w-16 rounded" style={shimmerStyle} />
            <div className="h-3 w-16 rounded" style={shimmerStyle} />
          </div>
        </div>
      </div>
    </div>
  )
}

// --- ForumPostCard ---

interface ForumPostCardProps {
  post: ForumPost
}

function ForumPostCard({ post }: ForumPostCardProps) {
  const router = useRouter()
  const avatarUrl = getAvatarUrl(post.user)

  return (
    <div
      onClick={() => router.push(`/community/forum/${post.id}`)}
      className={`
        group bg-[var(--color-charcoal)] border rounded-lg p-4 cursor-pointer
        transition-all duration-200
        hover:border-[rgba(99,102,241,0.25)] hover:bg-[var(--color-slate)]
        ${post.is_pinned
          ? 'border-[rgba(234,179,8,0.25)]'
          : 'border-[rgba(99,102,241,0.08)]'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            width={36}
            height={36}
            className="w-9 h-9 rounded-full shrink-0 object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] flex items-center justify-center text-void text-sm font-bold shrink-0">
            {post.user?.discord_username?.[0]?.toUpperCase() || '?'}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-2 flex-wrap">
            {post.is_pinned && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-[rgba(234,179,8,0.12)] text-yellow-400/80 border border-[rgba(234,179,8,0.2)] shrink-0">
                <Pin className="w-2.5 h-2.5" />
                Epingle
              </span>
            )}
            <h3 className="text-ivory font-medium text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">
              {post.title}
            </h3>
          </div>

          {/* Author + date */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-mist text-xs">
              {post.user?.discord_username || 'Anonyme'}
            </span>
            {post.user?.role && post.user.role !== 'member' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(99,102,241,0.15)] text-[var(--color-gold-pale)] font-medium uppercase">
                {post.user.role}
              </span>
            )}
            <span className="text-mist/40 text-xs">·</span>
            <span className="text-mist/60 text-xs">{formatRelativeDate(post.created_at)}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-2.5">
            <span className="flex items-center gap-1 text-mist/50 text-xs">
              <Eye className="w-3 h-3" />
              {post.views ?? 0}
            </span>
            <span className="flex items-center gap-1 text-mist/50 text-xs">
              <MessageSquare className="w-3 h-3" />
              {post.comment_count ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- ForumPostList ---

export default function ForumPostList({ channelSlug, channel }: ForumPostListProps) {
  const [showEditor, setShowEditor] = useState(false)
  const bottomSentinelRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useForumPosts(channelSlug)

  // Flatten + sort: pinned first, then by date desc
  const allPosts: ForumPost[] = data?.pages
    ? data.pages.flatMap((p: { posts: ForumPost[] }) => p.posts)
    : []

  const pinnedPosts = allPosts.filter((p) => p.is_pinned)
  const regularPosts = allPosts.filter((p) => !p.is_pinned)

  // Infinite scroll — load more when bottom sentinel is visible
  useEffect(() => {
    const sentinel = bottomSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { root: null, threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {channel.icon && (
              <span className="text-2xl">{channel.icon}</span>
            )}
            <h2 className="text-xl font-display font-bold text-ivory">
              {channel.name}
            </h2>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-gold)] hover:bg-[var(--color-gold-light)] text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau post
          </button>
        </div>

        {/* Editor (inline expand) */}
        {showEditor && (
          <div className="mb-6">
            <ForumEditor
              channelId={channel.id}
              channelSlug={channelSlug}
              onClose={() => setShowEditor(false)}
            />
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <ForumPostSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && allPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-mist font-medium">Aucun post pour l&apos;instant.</p>
            <p className="text-mist/50 text-sm mt-1">
              Cree le premier post dans ce forum !
            </p>
            <button
              onClick={() => setShowEditor(true)}
              className="mt-4 px-5 py-2.5 rounded-lg bg-[var(--color-gold)] hover:bg-[var(--color-gold-light)] text-white text-sm font-medium transition-colors"
            >
              Ecrire un post
            </button>
          </div>
        )}

        {/* Pinned posts */}
        {!isLoading && pinnedPosts.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Pin className="w-3.5 h-3.5 text-yellow-400/60" />
              <span className="text-xs font-medium text-mist/60 uppercase tracking-wider">
                Epingles
              </span>
            </div>
            <div className="space-y-2">
              {pinnedPosts.map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Regular posts */}
        {!isLoading && regularPosts.length > 0 && (
          <div className="space-y-2">
            {pinnedPosts.length > 0 && (
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
                <span className="text-mist/40 text-xs">Tous les posts</span>
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
              </div>
            )}
            {regularPosts.map((post) => (
              <ForumPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Load more sentinel */}
        <div ref={bottomSentinelRef} className="h-4" />

        {/* Fetching indicator */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="flex gap-1.5">
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

        {/* End of list */}
        {!isLoading && !hasNextPage && allPosts.length > 0 && (
          <p className="text-center text-mist/30 text-xs py-4">
            Tous les posts sont charges.
          </p>
        )}
      </div>
    </div>
  )
}
