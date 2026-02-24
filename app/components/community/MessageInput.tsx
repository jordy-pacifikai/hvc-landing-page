'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Send, ImagePlus, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useSendMessage } from '@/app/lib/community-hooks'
import { useSession } from '@/app/lib/formation-hooks'
import { uploadImage } from '@/app/lib/community-api'
import type { Message } from '@/app/lib/community-api'

interface MessageInputProps {
  channelId: string
  channelSlug: string
}

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

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// --- Image preview shimmer skeleton ---

function ImageUploadSkeleton() {
  return (
    <div
      className="rounded-lg w-40 h-28 shrink-0"
      style={{
        background: 'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
        backgroundSize: '800px 100%',
        animation: 'shimmer 1.8s ease-in-out infinite',
      }}
    />
  )
}

export default function MessageInput({ channelId, channelSlug }: MessageInputProps) {
  const [content, setContent] = useState('')
  const [pendingImage, setPendingImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const { mutate: send, isPending } = useSendMessage()
  const { data: session } = useSession() as { data: SessionData | null }

  // Cleanup object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Format non supporte. Formats acceptes : JPEG, PNG, GIF, WebP'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Image trop volumineuse. Taille maximale : 5 MB'
    }
    return null
  }

  const attachFile = useCallback((file: File) => {
    const err = validateFile(file)
    if (err) {
      setUploadError(err)
      return
    }
    setUploadError(null)
    // Revoke previous preview
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingImage(file)
    setPreviewUrl(URL.createObjectURL(file))
  }, [previewUrl])

  const removeImage = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingImage(null)
    setPreviewUrl(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [previewUrl])

  // Paste support
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of Array.from(items)) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          e.preventDefault()
          attachFile(file)
          break
        }
      }
    }
  }, [attachFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) attachFile(file)
  }

  const handleSend = useCallback(async () => {
    const trimmed = content.trim()
    if ((!trimmed && !pendingImage) || isPending || isUploading) return

    // Upload image first if present
    let uploadedUrl: string | undefined
    if (pendingImage) {
      setIsUploading(true)
      try {
        uploadedUrl = await uploadImage(pendingImage)
      } catch {
        setUploadError('Echec du telechargement. Reessaie.')
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }

    // Clear input state immediately for UX
    setContent('')
    removeImage()
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
      image_url: uploadedUrl ?? null,
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
      { channelId, content: trimmed, imageUrl: uploadedUrl },
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
          // Mark message as failed inline (Discord/Slack pattern)
          // Don't remove it — let the user retry from the message itself
          queryClient.setQueryData<InfiniteData>(
            ['community', 'messages', channelSlug],
            (old) => {
              if (!old) return old
              const pages = old.pages.map((page) => ({
                ...page,
                messages: page.messages.map((m) =>
                  m.id === tempId
                    ? { ...m, pending: false, failed: true, failedContent: trimmed }
                    : m
                ),
              }))
              return { ...old, pages }
            }
          )
        },
      }
    )
  }, [content, pendingImage, isPending, isUploading, send, channelId, channelSlug, queryClient, session, removeImage])

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

  const canSend = (content.trim() || pendingImage) && !isPending && !isUploading

  return (
    <div className="px-4 pb-4 pt-2">
      {/* Image preview area */}
      {(isUploading || previewUrl) && (
        <div className="mb-2 px-2">
          {isUploading ? (
            <ImageUploadSkeleton />
          ) : previewUrl ? (
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Apercu"
                className="rounded-lg max-h-[200px] object-contain border border-[rgba(255,255,255,0.06)] shadow-sm"
              />
              <button
                type="button"
                onClick={removeImage}
                className="
                  absolute -top-2 -right-2
                  w-5 h-5 rounded-full
                  bg-[var(--color-void)] border border-[rgba(255,255,255,0.12)]
                  flex items-center justify-center
                  text-mist hover:text-ivory
                  transition-colors
                "
                title="Supprimer l'image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Upload error */}
      {uploadError && (
        <p className="text-red-400/80 text-xs px-2 mb-1.5">{uploadError}</p>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 bg-[var(--color-charcoal)] rounded-lg border border-[rgba(99,102,241,0.1)] focus-within:border-[rgba(99,102,241,0.3)] transition-colors">
        {/* Image upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isPending}
          title="Joindre une image"
          className={`
            p-3 rounded-lg transition-all ml-1 mb-1 shrink-0
            ${isUploading || isPending
              ? 'text-mist/20 cursor-not-allowed'
              : 'text-mist hover:text-ivory hover:bg-[rgba(255,255,255,0.05)]'
            }
          `}
        >
          <ImagePlus className="w-4 h-4" />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onPaste={handlePaste}
          placeholder="Envoyer un message..."
          rows={1}
          className="flex-1 bg-transparent text-ivory placeholder-mist/50 text-sm px-2 py-3 resize-none outline-none max-h-[200px]"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`
            p-3 rounded-lg transition-all mr-1 mb-1 shrink-0
            ${canSend
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
