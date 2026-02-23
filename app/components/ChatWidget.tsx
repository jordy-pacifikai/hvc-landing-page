'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { trackEvent } from '../lib/posthog'
import { trackChatOpened, trackLeadCaptured } from '../lib/analytics'
import { getStoredUTM } from '../lib/utm'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: number
}

interface LeadData {
  name: string
  email: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'bot',
  content:
    "Salut ! Je suis l'assistant HVC. Pose-moi tes questions sur la formation, les résultats de nos traders, ou comment devenir Funded Trader.",
  timestamp: Date.now(),
}

const LEAD_CAPTURE_THRESHOLD = 0 // Show form immediately on chat open

// ─── Helper ───────────────────────────────────────────────────────────────────

function generateSessionId(): string {
  return `hvc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId()
  const stored = localStorage.getItem('hvc_chat_session')
  if (stored) return stored
  const id = generateSessionId()
  localStorage.setItem('hvc_chat_session', id)
  return id
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.15)',
          border: '1px solid rgba(99,102,241,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12 }}>H</span>
      </div>
      <div
        style={{
          background: 'rgba(30,30,36,0.9)',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: '16px 16px 16px 4px',
          padding: '10px 14px',
          display: 'flex',
          gap: 5,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'rgba(99,102,241,0.7)',
              display: 'inline-block',
              animation: `hvc-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Lead Capture Form ────────────────────────────────────────────────────────

interface LeadFormProps {
  onSubmit: (lead: LeadData) => void
}

function LeadForm({ onSubmit }: LeadFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    onSubmit({ name: name.trim(), email: email.trim() })
  }

  return (
    <div
      style={{
        alignSelf: 'flex-start',
        maxWidth: '90%',
        background: 'rgba(30,30,36,0.95)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        animation: 'hvc-slide-up 0.3s ease',
      }}
    >
      <p
        style={{
          color: '#f0f0f5',
          fontSize: 13,
          marginBottom: 12,
          lineHeight: 1.5,
        }}
      >
        Avant de commencer, dis-moi comment te joindre :
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="text"
          placeholder="Ton prenom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
          required
          style={{
            width: '100%',
            padding: '9px 12px',
            background: 'rgba(8,9,13,0.8)',
            border: '1px solid rgba(99,102,241,0.18)',
            borderRadius: 8,
            color: '#f0f0f5',
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <input
          type="email"
          placeholder="Ton email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          style={{
            width: '100%',
            padding: '9px 12px',
            background: 'rgba(8,9,13,0.8)',
            border: '1px solid rgba(99,102,241,0.18)',
            borderRadius: 8,
            color: '#f0f0f5',
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '9px',
            background: 'rgba(99,102,241,0.85)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          C&apos;est parti !
        </button>
      </form>
    </div>
  )
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

interface BubbleProps {
  message: Message
}

function Bubble({ message }: BubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 8,
        marginBottom: 10,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 12,
            color: '#f0f0f5',
          }}
        >
          H
        </div>
      )}
      <div
        style={{
          maxWidth: '78%',
          padding: '10px 14px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isUser
            ? 'rgba(99,102,241,0.75)'
            : 'rgba(30,30,36,0.9)',
          border: isUser
            ? '1px solid rgba(99,102,241,0.4)'
            : '1px solid rgba(99,102,241,0.12)',
          color: '#f0f0f5',
          fontSize: 13.5,
          lineHeight: 1.55,
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
    </div>
  )
}

// ─── Main ChatWidget ──────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState<string>(() => getOrCreateSessionId())
  const [userMessageCount, setUserMessageCount] = useState(0)
  const [lead, setLead] = useState<LeadData | null>(null)
  const [showLeadForm, setShowLeadForm] = useState(() => {
    // Don't show form if lead was already captured in a previous session
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('hvc_lead_captured')
    }
    return true
  })
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, showLeadForm])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [isOpen])

  const sendMessage = useCallback(
    async (text: string, leadData?: LeadData, skipUserBubble?: boolean) => {
      const trimmed = text.trim()
      if (!trimmed) return

      if (!skipUserBubble) {
        const userMsg: Message = {
          id: `user-${Date.now()}`,
          role: 'user',
          content: trimmed,
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, userMsg])
      }

      setInput('')
      setIsTyping(true)

      try {
        const utm = getStoredUTM()
        const body: Record<string, unknown> = {
          message: trimmed,
          sessionId,
          ...utm,
        }
        // Only send lead data once (when freshly captured)
        if (leadData) {
          body.name = leadData.name
          body.email = leadData.email
        }

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        const data = await res.json()

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: 'bot',
          content: data.response ?? "Desole, je suis temporairement indisponible. Reessaie dans quelques instants !",
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, botMsg])
      } catch {
        const errMsg: Message = {
          id: `bot-err-${Date.now()}`,
          role: 'bot',
          content:
            "Desole, je suis temporairement indisponible. Reessaie dans quelques instants !",
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, errMsg])
      } finally {
        setIsTyping(false)
      }
    },
    [sessionId, lead]
  )

  function handleToggleOpen() {
    const opening = !isOpen
    setIsOpen(opening)
    if (opening) {
      trackEvent('chat_opened')
      trackChatOpened()
    }
  }

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return

    const nextCount = userMessageCount + 1
    setUserMessageCount(nextCount)

    trackEvent('chat_message_sent')

    // Show lead form after threshold if not yet captured
    if (nextCount >= LEAD_CAPTURE_THRESHOLD && !lead && !showLeadForm) {
      setPendingMessage(trimmed)
      setInput('')
      // Add user message visually first
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMsg])
      setShowLeadForm(true)
      return
    }

    sendMessage(trimmed)
  }

  function handleLeadSubmit(leadData: LeadData) {
    setLead(leadData)
    setShowLeadForm(false)
    localStorage.setItem('hvc_lead_captured', 'true')
    trackEvent('lead_captured', { source: 'chat_widget' })
    trackLeadCaptured('chat_widget')
    if (pendingMessage) {
      // User bubble was already added in handleSend — skip adding it again
      sendMessage(pendingMessage, leadData, true)
      setPendingMessage(null)
    } else {
      // Send an initial greeting with lead data so the backend captures it
      sendMessage('Bonjour !', leadData)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes hvc-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes hvc-pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5), 0 4px 24px rgba(99,102,241,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(99,102,241,0), 0 4px 32px rgba(99,102,241,0.5); }
        }
        @keyframes hvc-slide-up {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Floating Button */}
      <button
        onClick={handleToggleOpen}
        aria-label="Ouvrir le chat HVC"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.9)',
          border: '1px solid rgba(99,102,241,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9998,
          animation: isOpen ? 'none' : 'hvc-pulse-glow 2.4s ease-in-out infinite',
          transition: 'background 0.2s, transform 0.2s',
          transform: isOpen ? 'rotate(90deg)' : 'none',
        }}
      >
        {isOpen ? (
          <X size={22} color="#f0f0f5" />
        ) : (
          <MessageCircle size={22} color="#f0f0f5" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 28,
            width: 380,
            maxWidth: 'calc(100vw - 32px)',
            height: 500,
            maxHeight: 'calc(100vh - 140px)',
            background: 'rgba(20,20,22,0.97)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9998,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
            animation: 'hvc-slide-up 0.22s ease-out',
            fontFamily: 'inherit',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(99,102,241,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(99,102,241,0.2)',
                border: '1px solid rgba(99,102,241,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: '#f0f0f5',
                flexShrink: 0,
              }}
            >
              H
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: '#f0f0f5',
                  fontWeight: 600,
                  fontSize: 14,
                  margin: 0,
                  letterSpacing: '0.01em',
                }}
              >
                HVC Assistant
              </p>
              <p
                style={{
                  color: 'rgba(99,102,241,0.85)',
                  fontSize: 11.5,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#4ade80',
                    display: 'inline-block',
                  }}
                />
                En ligne
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le chat"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#8888a0',
                display: 'flex',
                padding: 4,
                borderRadius: 6,
                transition: 'color 0.15s',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 14px 4px 14px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(99,102,241,0.2) transparent',
            }}
          >
            {messages.map((msg) => (
              <Bubble key={msg.id} message={msg} />
            ))}

            {showLeadForm && (
              <LeadForm onSubmit={handleLeadSubmit} />
            )}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '10px 12px',
              borderTop: '1px solid rgba(99,102,241,0.12)',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Pose ta question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping || showLeadForm}
              style={{
                flex: 1,
                background: 'rgba(30,30,36,0.8)',
                border: '1px solid rgba(99,102,241,0.18)',
                borderRadius: 10,
                padding: '9px 13px',
                color: '#f0f0f5',
                fontSize: 13.5,
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
                opacity: showLeadForm ? 0.4 : 1,
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping || showLeadForm}
              aria-label="Envoyer"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background:
                  !input.trim() || isTyping || showLeadForm
                    ? 'rgba(99,102,241,0.25)'
                    : 'rgba(99,102,241,0.85)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor:
                  !input.trim() || isTyping || showLeadForm ? 'not-allowed' : 'pointer',
                flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              {isTyping ? (
                <Loader2 size={16} color="#f0f0f5" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Send size={16} color="#f0f0f5" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
