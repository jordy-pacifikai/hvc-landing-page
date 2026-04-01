'use client'

import { useState } from 'react'
import { Mail, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import SectionReveal from '../effects/SectionReveal'
import GlassCard from '../effects/GlassCard'
import { trackEvent, identifyLead } from '../../lib/posthog'
import { trackNewsletterSignup } from '../../lib/analytics'
import { getStoredUTM } from '../../lib/utm'

export default function NewsletterSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const utm = getStoredUTM()
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, ...utm }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        trackEvent('newsletter_signup', { source: 'landing_page' })
        trackNewsletterSignup()
        identifyLead(email, { name, source: 'newsletter' })
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Une erreur est survenue.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Une erreur est survenue.')
    }
  }

  return (
    <section className="py-section relative">
      <div className="max-w-xl mx-auto px-5 sm:px-8">
        <SectionReveal>
          <div className="reveal-child">
            <GlassCard className="p-8 sm:p-12">
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <Mail className="w-8 h-8 text-accent mx-auto mb-4 opacity-80" />
                  <h2 className="font-display text-display-md mb-3 text-ivory">
                    Progresse chaque semaine
                  </h2>
                  <p className="text-ivory-dim text-sm leading-relaxed">
                    Rejoins 1000+ traders et reçois nos meilleurs conseils chaque semaine.
                  </p>
                </div>

                {status === 'success' ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                    <p className="text-ivory text-lg font-medium">Inscription confirmée !</p>
                    <p className="text-ivory-dim text-sm">Check tes emails.</p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ton prénom"
                        required
                        disabled={status === 'loading'}
                        aria-label="Prénom"
                        className="flex-1 min-w-0 bg-black-card border border-black-border rounded-full px-5 py-3 text-ivory text-sm placeholder:text-ivory-ghost focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Ton email"
                        required
                        disabled={status === 'loading'}
                        aria-label="Email"
                        className="flex-1 min-w-0 bg-black-card border border-black-border rounded-full px-5 py-3 text-ivory text-sm placeholder:text-ivory-ghost focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <XCircle className="w-4 h-4 flex-shrink-0" />
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Inscription...
                        </span>
                      ) : (
                        <>
                          Recevoir les conseils gratuits
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-ivory-ghost">
                      Zéro spam. Désabonnement en 1 clic.
                    </p>
                  </form>
                )}
              </div>
            </GlassCard>
          </div>
        </SectionReveal>
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}
