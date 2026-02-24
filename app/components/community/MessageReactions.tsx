'use client'

import { useState, useRef, useEffect } from 'react'
import { useAddReaction, useRemoveReaction } from '@/app/lib/community-hooks'

// Common emojis for the quick picker
const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '🚀', '💯']

interface Reaction {
  emoji: string
  count: number
  has_reacted: boolean
}

interface MessageReactionsProps {
  messageId: string
  reactions: Reaction[]
  // showAddButton is controlled externally (passed true on message hover)
  showAddButton?: boolean
}

function EmojiPicker({
  onSelect,
  onClose,
}: {
  onSelect: (emoji: string) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-1.5 left-0 z-50 p-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] shadow-xl"
      style={{ background: 'var(--color-charcoal, #1a1a1a)' }}
    >
      <div className="grid grid-cols-4 gap-0.5">
        {COMMON_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => {
              onSelect(emoji)
              onClose()
            }}
            className="w-8 h-8 flex items-center justify-center text-lg rounded-md hover:bg-[rgba(255,255,255,0.08)] transition-colors"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MessageReactions({
  messageId,
  reactions,
  showAddButton = false,
}: MessageReactionsProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const addReaction = useAddReaction()
  const removeReaction = useRemoveReaction()

  function handleReactionClick(reaction: Reaction) {
    if (reaction.has_reacted) {
      removeReaction.mutate({ messageId, emoji: reaction.emoji })
    } else {
      addReaction.mutate({ messageId, emoji: reaction.emoji })
    }
  }

  function handlePickerSelect(emoji: string) {
    // Check if already reacted with this emoji
    const existing = reactions.find((r) => r.emoji === emoji)
    if (existing?.has_reacted) {
      removeReaction.mutate({ messageId, emoji })
    } else {
      addReaction.mutate({ messageId, emoji })
    }
  }

  const hasReactions = reactions.length > 0
  const showRow = hasReactions || showAddButton

  if (!showRow) return null

  return (
    <div className="flex items-center gap-1 flex-wrap mt-1 relative">
      {/* Reaction pills */}
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          type="button"
          onClick={() => handleReactionClick(reaction)}
          disabled={addReaction.isPending || removeReaction.isPending}
          className={[
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
            'border transition-all duration-150 select-none',
            'hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed',
            reaction.has_reacted
              ? 'border-champagne/30 bg-champagne/10 text-champagne'
              : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-mist/70 hover:border-[rgba(255,255,255,0.15)] hover:text-mist',
          ].join(' ')}
          title={reaction.has_reacted ? 'Retirer ta réaction' : 'Réagir'}
        >
          <span className="leading-none">{reaction.emoji}</span>
          <span
            className={[
              'font-medium tabular-nums',
              reaction.has_reacted ? 'text-champagne/80' : 'text-mist/60',
            ].join(' ')}
          >
            {reaction.count}
          </span>
        </button>
      ))}

      {/* Add reaction button */}
      {showAddButton && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            className={[
              'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs',
              'border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]',
              'text-mist/40 hover:text-mist/80 hover:border-[rgba(255,255,255,0.15)]',
              'hover:bg-[rgba(255,255,255,0.06)] transition-all duration-150',
              'active:scale-95',
              pickerOpen ? 'border-champagne/20 bg-champagne/5 text-champagne/70' : '',
            ].join(' ')}
            title="Ajouter une réaction"
          >
            +
          </button>
          {pickerOpen && (
            <EmojiPicker
              onSelect={handlePickerSelect}
              onClose={() => setPickerOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}
