'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { X, Eye, EyeOff, Send } from 'lucide-react'
import { useCreateForumPost } from '@/app/lib/community-hooks'

interface ForumEditorProps {
  channelId: string
  channelSlug: string
  onClose: () => void
}

export default function ForumEditor({ channelId, onClose }: ForumEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({})

  const { mutate: createPost, isPending } = useCreateForumPost()

  function validate(): boolean {
    const newErrors: { title?: string; content?: string } = {}
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis.'
    }
    if (content.trim().length < 10) {
      newErrors.content = 'Le contenu doit faire au moins 10 caracteres.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit() {
    if (!validate() || isPending) return

    createPost(
      { channelId, title: title.trim(), content: content.trim() },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  return (
    <div className="bg-[var(--color-charcoal)] border border-[rgba(99,102,241,0.15)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(99,102,241,0.08)]">
        <h3 className="text-ivory font-medium text-sm">Nouveau post</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-mist hover:text-ivory transition-colors px-2 py-1 rounded hover:bg-[rgba(255,255,255,0.05)]"
          >
            {preview ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Editer
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Apercu
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="text-mist hover:text-ivory transition-colors p-1 rounded hover:bg-[rgba(255,255,255,0.05)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Title input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
            }}
            placeholder="Titre du post..."
            maxLength={200}
            className={`
              w-full bg-[var(--color-void)] text-ivory placeholder-mist/50 text-sm
              px-3 py-2.5 rounded-lg outline-none transition-colors
              border ${errors.title
                ? 'border-red-500/50 focus:border-red-500'
                : 'border-[rgba(99,102,241,0.1)] focus:border-[rgba(99,102,241,0.35)]'
              }
            `}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Content / Preview */}
        {preview ? (
          <div
            className={`
              min-h-[180px] bg-[var(--color-void)] border rounded-lg px-3 py-2.5
              ${errors.content
                ? 'border-red-500/50'
                : 'border-[rgba(99,102,241,0.1)]'
              }
            `}
          >
            {content.trim() ? (
              <div className="text-pearl text-sm prose-forum">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-mist/40 text-sm italic">Rien a previsualiser...</p>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }))
              }}
              placeholder="Contenu du post... (Markdown supporte)"
              rows={7}
              className={`
                w-full bg-[var(--color-void)] text-ivory placeholder-mist/50 text-sm
                px-3 py-2.5 rounded-lg outline-none transition-colors resize-y
                border font-mono leading-relaxed
                ${errors.content
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-[rgba(99,102,241,0.1)] focus:border-[rgba(99,102,241,0.35)]'
                }
              `}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-400">{errors.content}</p>
            )}
            <p className="mt-1 text-xs text-mist/40">
              Markdown supporte : **gras**, *italique*, `code`, etc.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[rgba(99,102,241,0.08)]">
        <button
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 text-sm text-mist hover:text-ivory transition-colors rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending || !title.trim() || content.trim().length < 10}
          className={`
            flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all
            ${isPending || !title.trim() || content.trim().length < 10
              ? 'bg-[var(--color-slate)] text-mist/40 cursor-not-allowed'
              : 'bg-[var(--color-gold)] hover:bg-[var(--color-gold-light)] text-white'
            }
          `}
        >
          {isPending ? (
            <>
              <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
              Publication...
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Publier
            </>
          )}
        </button>
      </div>
    </div>
  )
}
