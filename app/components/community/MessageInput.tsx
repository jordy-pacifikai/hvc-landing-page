'use client'

import { useState, useRef, useCallback } from 'react'
import { Send } from 'lucide-react'
import { useSendMessage } from '@/app/lib/community-hooks'
import { useSession } from '@/app/lib/formation-hooks'

interface MessageInputProps {
  channelId: string
  channelSlug: string
}

export default function MessageInput({ channelId, channelSlug }: MessageInputProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { mutate: send, isPending } = useSendMessage()
  const { data: session } = useSession()

  const handleSend = useCallback(() => {
    const trimmed = content.trim()
    if (!trimmed || isPending) return

    send(
      { channelId, content: trimmed },
      {
        onSuccess: () => {
          setContent('')
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
          }
        },
      }
    )
  }, [content, isPending, send, channelId])

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
