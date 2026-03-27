'use client'

import { Suspense, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Shield, Zap, Crown, Star, Loader2, Mail } from 'lucide-react'

const STAN_MONTHLY_URL = 'https://stan.store/highvaluecapital/p/hvc-community'
const STAN_ANNUAL_URL = 'https://stan.store/highvaluecapital/p/hvc-community-annuel'
const ACTIVATE_URL = 'https://community.highvaluecapital.club/api/admin/activate-stan'
const ACTIVATE_SECRET = 'hvc-grant-2026'

function CheckoutContent() {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const plans = {
    monthly: {
      price: 49,
      period: '/mois',
      subtitle: 'Sans engagement',
      url: STAN_MONTHLY_URL,
    },
    annual: {
      price: 294,
      period: '/an',
      subtitle: 'Soit 24,50\u20AC/mois',
      url: STAN_ANNUAL_URL,
    },
  }

  const selected = plans[plan]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Entre ton email pour continuer')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Pre-activate account in Supabase + send welcome email
      await fetch(ACTIVATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, secret: ACTIVATE_SECRET, plan }),
      })
      // Redirect to Stan checkout regardless of activation result
      // (existing users will just get a "already exists" response, which is fine)
      window.location.href = selected.url
    } catch {
      // Even if activation fails, redirect to Stan — account can be activated later
      window.location.href = selected.url
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
      <div className="noise-overlay" />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ivory-dim hover:text-ivory transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>

          <Image
            src="/logo-hvc-gradient.png"
            alt="High Value Capital"
            width={180}
            height={65}
            className="mx-auto mb-6"
          />

          <h1 className="font-display text-3xl md:text-4xl font-medium text-ivory mb-3">
            Rejoins la communaut&eacute; <span className="italic text-accent-gradient">HVC</span>
          </h1>
          <p className="text-ivory-muted max-w-md mx-auto">
            Acc&egrave;de &agrave; la formation, aux analyses, au journal IA et au r&eacute;seau de traders les plus ambitieux.
          </p>
        </div>

        {/* Plan Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-black-card border border-black-border rounded-xl p-1">
            <button
              onClick={() => setPlan('monthly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                plan === 'monthly'
                  ? 'bg-accent text-black'
                  : 'text-ivory-muted hover:text-ivory'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setPlan('annual')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                plan === 'annual'
                  ? 'bg-accent text-black'
                  : 'text-ivory-muted hover:text-ivory'
              }`}
            >
              Annuel
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-bold">
                -50%
              </span>
            </button>
          </div>
        </div>

        {/* Card principale */}
        <div className="bg-black-card border border-black-border rounded-2xl p-8 md:p-12">
          {/* Prix */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-display text-5xl md:text-6xl font-bold text-ivory">
                {selected.price}&euro;
              </span>
              <span className="text-ivory-muted text-lg">{selected.period}</span>
            </div>
            <p className="text-ivory-dim text-sm mt-2">
              {selected.subtitle}
              {plan === 'annual' && (
                <span className="text-green-400 font-medium"> &mdash; &Eacute;conomise 294&euro;/an</span>
              )}
            </p>
          </div>

          {/* Avantages */}
          <div className="mb-8">
            <h3 className="font-display text-lg font-medium mb-5 flex items-center gap-2 text-ivory">
              <Zap className="w-5 h-5 text-accent" />
              Tout ce qui est inclus
            </h3>
            <ul className="space-y-3">
              {[
                { icon: Star, text: 'Formation compl\u00e8te ARD (7+ modules)' },
                { icon: Crown, text: 'Communaut\u00e9 priv\u00e9e de traders' },
                { icon: CheckCircle, text: 'Analyses de march\u00e9 quotidiennes' },
                { icon: CheckCircle, text: 'Journal de trading intelligent avec IA' },
                { icon: CheckCircle, text: 'Lives hebdomadaires exclusifs' },
                { icon: CheckCircle, text: 'Syst\u00e8me de gamification et r\u00e9compenses' },
                { icon: CheckCircle, text: 'R\u00e9siliable \u00e0 tout moment' },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-ivory-muted">
                  <item.icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Email + CTA */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory-dim" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  placeholder="Ton email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-black-elevated border border-black-border rounded-xl text-ivory placeholder:text-ivory-dim focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent hover:bg-accent/90 disabled:opacity-50 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirection...
                </>
              ) : (
                plan === 'annual' ? 'Rejoindre \u2014 294\u20AC/an' : 'Rejoindre \u2014 49\u20AC/mois'
              )}
            </button>
          </form>

          <p className="text-ivory-dim text-xs text-center mt-4">
            Paiement 100% s&eacute;curis&eacute; par carte bancaire
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-ivory-dim text-sm">
            <Shield className="w-4 h-4 text-accent/50" />
            <span>Paiement 100% s\u00e9curis\u00e9 &mdash; Donn\u00e9es prot\u00e9g\u00e9es</span>
          </div>
          <p className="text-ivory-dim text-sm">
            D&eacute;j&agrave; membre ?{' '}
            <a
              href="https://community.highvaluecapital.club/login"
              className="text-accent hover:underline"
            >
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  )
}
