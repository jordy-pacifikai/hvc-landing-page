'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MoreHorizontal, Trash2, Flag, Link2 } from 'lucide-react'
import { useDeleteMessage } from '@/app/lib/community-hooks'

interface MessageActionsProps {
  messageId: string
  messageAuthorId: string
  channelSlug: string
  currentUserId: string | undefined
  currentUserRole: string | undefined
}

export default function MessageActions({
  messageId,
  messageAuthorId,
  channelSlug,
  currentUserId,
  currentUserRole,
}: MessageActionsProps) {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const deleteMessage = useDeleteMessage()

  const isAuthor = currentUserId === messageAuthorId
  const isModerator =
    currentUserRole === 'admin' || currentUserRole === 'moderator'
  const canDelete = isAuthor || isModerator

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const handleDelete = useCallback(() => {
    setOpen(false)
    deleteMessage.mutate(messageId)
  }, [deleteMessage, messageId])

  const handleReport = useCallback(() => {
    setOpen(false)
    setToast('Message signale')
  }, [])

  const handleCopyLink = useCallback(() => {
    setOpen(false)
    const url = `${window.location.origin}/community/${channelSlug}#msg-${messageId}`
    navigator.clipboard.writeText(url).then(
      () => setToast('Lien copie'),
      () => setToast('Impossible de copier')
    )
  }, [channelSlug, messageId])

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Actions"
        className={[
          'inline-flex items-center justify-center w-7 h-7 rounded-md',
          'border border-transparent',
          'text-mist/40 hover:text-mist/80',
          'hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.08)]',
          'transition-all duration-150 active:scale-95',
          open ? 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.08)] text-mist/80' : '',
        ].join(' ')}
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={[
            'absolute right-0 top-full mt-1 z-50 min-w-[160px]',
            'rounded-lg border border-[rgba(99,102,241,0.12)]',
            'bg-[var(--color-charcoal)] shadow-xl',
            'py-1 overflow-hidden',
          ].join(' ')}
        >
          {/* Supprimer — only for author or mod */}
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMessage.isPending}
              className={[
                'w-full flex items-center gap-2.5 px-3 py-2 text-sm',
                'text-red-400 hover:text-red-300',
                'hover:bg-red-500/10',
                'transition-colors duration-100',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>Supprimer</span>
            </button>
          )}

          {/* Signaler — always visible */}
          <button
            type="button"
            onClick={handleReport}
            className={[
              'w-full flex items-center gap-2.5 px-3 py-2 text-sm',
              'text-mist hover:text-ivory',
              'hover:bg-[rgba(255,255,255,0.05)]',
              'transition-colors duration-100',
            ].join(' ')}
          >
            <Flag className="w-3.5 h-3.5 shrink-0" />
            <span>Signaler</span>
          </button>

          {/* Separator */}
          <div className="my-1 h-px bg-[rgba(255,255,255,0.06)]" />

          {/* Copier le lien — always visible */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={[
              'w-full flex items-center gap-2.5 px-3 py-2 text-sm',
              'text-mist hover:text-ivory',
              'hover:bg-[rgba(255,255,255,0.05)]',
              'transition-colors duration-100',
            ].join(' ')}
          >
            <Link2 className="w-3.5 h-3.5 shrink-0" />
            <span>Copier le lien</span>
          </button>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={[
            'absolute right-0 top-full mt-1 z-50',
            'px-3 py-1.5 rounded-md text-xs font-medium',
            'bg-[var(--color-slate)] text-ivory border border-[rgba(255,255,255,0.08)]',
            'shadow-lg whitespace-nowrap',
            'animate-fade-in',
          ].join(' ')}
        >
          {toast}
        </div>
      )}
    </div>
  )
}
