'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, ArrowLeft, CheckCircle, Shield, Zap } from 'lucide-react'

declare global {
  interface Window {
    Stripe?: any
  }
}

function SimpleParticles() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${4 + Math.random() * 3}s`
  }))

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle particle-twinkle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration
          }}
        />
      ))}
    </div>
  )
}

function SimpleBackground() {
  return (
    <>
      <div className="animated-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <div className="grid-lines" />
      <SimpleParticles />
      <div className="noise-overlay" />
    </>
  )
}

const DISCORD_CLIENT_ID = '988148432843735073'
const DISCORD_REDIRECT_URI = 'https://www.highvaluecapital.club/api/discord/callback'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const discordId = searchParams.get('discord_id')
  const discordUsername = searchParams.get('discord_username')
  const discordToken = searchParams.get('discord_token')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If no discord_id, redirect to Discord OAuth first
    if (!discordId) {
      const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify+guilds.join`
      window.location.href = oauthUrl
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.async = true
    script.onload = initializeCheckout
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discordId])

  const initializeCheckout = async () => {
    try {
      const stripe = window.Stripe('pk_live_51QaiinDFDOh4UH0dImQcweObLWJQT3NY7jA9lVI1mp8NzH2p9RhHzNzubGF65zDSdT9z3AEZZgj2S7qm39z4DdoY003pR0EYJh')

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discord_id: discordId,
          discord_username: discordUsername,
          discord_token: discordToken,
        }),
      })

      const { sessionId, error: sessionError } = await response.json()

      if (sessionError) {
        throw new Error(sessionError)
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (stripeError) {
        throw stripeError
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
      <SimpleBackground />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-mist hover:text-champagne transition-colors mb-8"
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

          <h1 className="font-display text-3xl md:text-4xl font-medium mb-3">
            Formation Trading <span className="italic text-gradient-gold">Premium</span>
          </h1>
          <p className="text-mist">Paiement sécurisé par Stripe</p>

          {/* Discord connected indicator */}
          {discordUsername && (
            <div className="mt-4 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2">
              <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              <span className="text-indigo-300 text-sm">Connecté : {discordUsername}</span>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
          )}
        </div>

        {/* Card principale */}
        <div className="card-highlight p-8 md:p-12 rounded-2xl glow-gold">
          {loading && !error && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-champagne/10 rounded-full mb-6">
                <Loader2 className="w-8 h-8 text-champagne animate-spin" />
              </div>
              <p className="text-ivory text-lg font-medium mb-2">Redirection vers le paiement sécurisé...</p>
              <p className="text-mist text-sm">Veuillez patienter quelques secondes</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-6">
                <span className="text-3xl">!</span>
              </div>
              <h2 className="font-display text-xl font-medium mb-3 text-ivory">Une erreur est survenue</h2>
              <p className="text-mist mb-8">{error}</p>
              <Link
                href="/"
                className="btn-primary inline-flex"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Retour à l'accueil
                </span>
              </Link>
            </div>
          )}

          {loading && !error && (
            <>
              <div className="gradient-line my-8" />

              <div>
                <h3 className="font-display text-lg font-medium mb-5 flex items-center gap-2 text-ivory">
                  <Zap className="w-5 h-5 text-champagne" />
                  Ce que tu vas recevoir
                </h3>
                <ul className="space-y-3">
                  {[
                    'Accès complet à la formation ARD (7+ modules)',
                    'Groupe privé Premium sur Discord',
                    'Lives hebdomadaires exclusifs',
                    'Support communauté active 24/7',
                    'Garantie satisfait ou remboursé 7 jours',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-pearl">
                      <CheckCircle className="w-5 h-5 text-champagne flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-5 bg-glass border border-champagne/20 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-mist">Prix</span>
                    <span className="font-display text-3xl font-medium text-champagne">49€<span className="text-lg">/mois</span></span>
                  </div>
                  <p className="text-smoke text-xs mt-2">Sans engagement - Résiliable à tout moment</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer sécurité */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-mist text-sm">
            <Shield className="w-4 h-4 text-champagne/70" />
            <span>Paiement 100% sécurisé - Cryptage SSL - Données protégées par Stripe</span>
          </div>
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
