'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Eye, MessageSquare, Send, Pin } from 'lucide-react'
import { useForumPost, useAddForumComment } from '@/app/lib/community-hooks'
import type { ForumComment } from '@/app/lib/community-api'

export default function ForumPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = use(params)
  const router = useRouter()

  const { data, isLoading } = useForumPost(postId)
  const { mutate: addComment, isPending: isCommenting } = useAddForumComment()

  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState('')

  const post = data?.post
  const comments: ForumComment[] = data?.comments ?? []

  // --- Helpers ---

  function getAvatarUrl(
    user: { discord_id?: string; discord_avatar?: string | null; id?: string } | undefined
  ): string | null {
    if (!user?.discord_avatar) return null
    const discordId = user.discord_id || user.id
    return `https://cdn.discordapp.com/avatars/${discordId}/${user.discord_avatar}.png?size=64`
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatRelative(dateStr: string): string {
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

  function handleAddComment() {
    const trimmed = comment.trim()
    if (!trimmed) {
      setCommentError('Le commentaire ne peut pas etre vide.')
      return
    }
    if (trimmed.length < 2) {
      setCommentError('Le commentaire est trop court.')
      return
    }
    setCommentError('')
    addComment(
      { postId, content: trimmed },
      {
        onSuccess: () => {
          setComment('')
        },
      }
    )
  }

  const shimmerStyle = {
    background:
      'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
    backgroundSize: '800px 100%',
    animation: 'shimmer 1.8s ease-in-out infinite',
  }

  // --- Loading skeleton ---
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {/* Back button skeleton */}
          <div className="h-8 w-32 rounded-lg" style={shimmerStyle} />

          {/* Post skeleton */}
          <div className="bg-[var(--color-charcoal)] border border-[rgba(99,102,241,0.08)] rounded-xl p-6 space-y-4">
            <div className="h-7 w-3/4 rounded" style={shimmerStyle} />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full" style={shimmerStyle} />
              <div className="space-y-1.5">
                <div className="h-3 w-24 rounded" style={shimmerStyle} />
                <div className="h-3 w-16 rounded" style={shimmerStyle} />
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 rounded" style={{ ...shimmerStyle, width: i === 2 ? '60%' : '100%' }} />
            ))}
          </div>

          {/* Comments skeleton */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full shrink-0" style={shimmerStyle} />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 rounded" style={shimmerStyle} />
                <div className="h-3 w-3/4 rounded" style={shimmerStyle} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // --- Not found ---
  if (!post) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl">🔍</div>
          <p className="text-mist">Post introuvable.</p>
          <button
            onClick={() => router.back()}
            className="text-[var(--color-gold-pale)] text-sm hover:underline"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }

  const postAvatarUrl = getAvatarUrl(post.user)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-mist hover:text-ivory transition-colors text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Retour au forum
        </button>

        {/* Post card */}
        <article className="bg-[var(--color-charcoal)] border border-[rgba(99,102,241,0.1)] rounded-xl overflow-hidden">
          {/* Post header */}
          <div className="px-6 pt-6 pb-4 border-b border-[rgba(99,102,241,0.06)]">
            {/* Pinned badge */}
            {post.is_pinned && (
              <div className="flex items-center gap-1.5 text-yellow-400/70 text-xs font-medium mb-2">
                <Pin className="w-3 h-3" />
                Post epingle
              </div>
            )}

            {/* Title */}
            <h1 className="font-display text-2xl font-bold text-ivory leading-snug mb-4">
              {post.title}
            </h1>

            {/* Author row */}
            <div className="flex items-center gap-3">
              {postAvatarUrl ? (
                <img
                  src={postAvatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {post.user?.discord_username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-ivory font-medium text-sm">
                    {post.user?.discord_username || 'Anonyme'}
                  </span>
                  {post.user?.role && post.user.role !== 'member' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(99,102,241,0.15)] text-[var(--color-gold-pale)] font-medium uppercase">
                      {post.user.role}
                    </span>
                  )}
                </div>
                <p className="text-mist/60 text-xs mt-0.5">{formatDate(post.created_at)}</p>
              </div>

              {/* Stats — pushed right */}
              <div className="ml-auto flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-mist/50 text-xs">
                  <Eye className="w-3.5 h-3.5" />
                  {post.views ?? 0}
                </span>
                <span className="flex items-center gap-1.5 text-mist/50 text-xs">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {comments.length}
                </span>
              </div>
            </div>
          </div>

          {/* Post content */}
          <div className="px-6 py-5">
            <div className="text-pearl text-sm leading-relaxed prose-forum">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0 whitespace-pre-wrap">{children}</p>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-champagne)] underline underline-offset-2 hover:opacity-80 transition-opacity"
                    >
                      {children}
                    </a>
                  ),
                  h1: ({ children }) => <h1 className="text-ivory font-bold text-xl mt-4 mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-ivory font-semibold text-lg mt-4 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-ivory font-semibold text-base mt-3 mb-1">{children}</h3>,
                  strong: ({ children }) => <strong className="text-ivory font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="text-pearl/80 italic">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 text-pearl">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 text-pearl">{children}</ol>,
                  li: ({ children }) => <li className="text-pearl">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-[var(--color-gold)] pl-4 my-3 text-mist italic">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="border-[rgba(255,255,255,0.06)] my-4" />,
                  code: ({ children, className }) => {
                    const isBlock = className?.includes('language-')
                    if (isBlock) {
                      return (
                        <pre className="bg-[var(--color-void)] border border-[rgba(255,255,255,0.06)] rounded-md p-3 my-3 overflow-x-auto">
                          <code className="text-xs text-pearl font-mono">{children}</code>
                        </pre>
                      )
                    }
                    return (
                      <code className="bg-[var(--color-void)] text-[var(--color-champagne)] font-mono text-xs px-1.5 py-0.5 rounded">
                        {children}
                      </code>
                    )
                  },
                  pre: ({ children }) => <>{children}</>,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        {/* Comments section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-4 h-4 text-mist/60" />
            <h2 className="text-ivory font-medium text-sm">
              {comments.length === 0
                ? 'Aucun commentaire'
                : `${comments.length} commentaire${comments.length > 1 ? 's' : ''}`}
            </h2>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
          </div>

          {/* Comment list */}
          {comments.length > 0 && (
            <div className="space-y-4 mb-6">
              {comments.map((c) => {
                const avatarUrl = getAvatarUrl(c.user)
                return (
                  <div key={c.id} className="flex gap-3">
                    {/* Avatar */}
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt=""
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-slate)] to-[var(--color-smoke)] flex items-center justify-center text-mist text-xs font-bold shrink-0 mt-0.5">
                        {c.user?.discord_username?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}

                    {/* Comment body */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-[var(--color-charcoal)] border border-[rgba(99,102,241,0.06)] rounded-lg px-3 py-2.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-ivory text-xs font-medium">
                            {c.user?.discord_username || 'Anonyme'}
                          </span>
                          {c.user?.role && c.user.role !== 'member' && (
                            <span className="text-[10px] px-1 py-0.5 rounded-full bg-[rgba(99,102,241,0.12)] text-[var(--color-gold-pale)] font-medium uppercase">
                              {c.user.role}
                            </span>
                          )}
                          <span className="text-mist/40 text-xs ml-auto shrink-0">
                            {formatRelative(c.created_at)}
                          </span>
                        </div>
                        <div className="text-pearl text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {c.content}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Comment input */}
          <div className="bg-[var(--color-charcoal)] border border-[rgba(99,102,241,0.08)] rounded-xl overflow-hidden focus-within:border-[rgba(99,102,241,0.25)] transition-colors">
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value)
                if (commentError) setCommentError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAddComment()
                }
              }}
              placeholder="Ajouter un commentaire..."
              rows={3}
              className="w-full bg-transparent text-ivory placeholder-mist/50 text-sm px-4 py-3 resize-none outline-none"
            />
            {commentError && (
              <p className="px-4 pb-2 text-xs text-red-400">{commentError}</p>
            )}
            <div className="flex items-center justify-between px-4 py-2 border-t border-[rgba(99,102,241,0.06)]">
              <p className="text-mist/40 text-xs">Entree pour envoyer, Shift+Entree pour nouvelle ligne</p>
              <button
                onClick={handleAddComment}
                disabled={isCommenting || !comment.trim()}
                className={`
                  flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${isCommenting || !comment.trim()
                    ? 'bg-[var(--color-slate)] text-mist/40 cursor-not-allowed'
                    : 'bg-[var(--color-gold)] hover:bg-[var(--color-gold-light)] text-white'
                  }
                `}
              >
                {isCommenting ? (
                  <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Commenter
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
