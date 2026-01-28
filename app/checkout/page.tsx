'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, ArrowLeft, CheckCircle, Shield, Zap } from 'lucide-react'

declare global {
  interface Window {
    Stripe?: any
  }
}

// Particules simplifiées
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

// Background simplifié
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

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.async = true
    script.onload = initializeCheckout
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const initializeCheckout = async () => {
    try {
      const stripe = window.Stripe('pk_live_51QaiinDFDOh4UH0dImQcweObLWJQT3NY7jA9lVI1mp8NzH2p9RhHzNzubGF65zDSdT9z3AEZZgj2S7qm39z4DdoY003pR0EYJh')

      const response = await fetch('/api/checkout', {
        method: 'POST',
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
            src="/logo-hvc-white.png"
            alt="High Value Capital"
            width={180}
            height={65}
            className="mx-auto mb-6"
          />

          <h1 className="font-display text-3xl md:text-4xl font-medium mb-3">
            Formation Trading <span className="italic text-gradient-gold">Premium</span>
          </h1>
          <p className="text-mist">Paiement sécurisé par Stripe</p>
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
                <span className="text-3xl">⚠️</span>
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
                    'Groupe privé Premium sur Heartbeat',
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
                    <span className="font-display text-3xl font-medium text-champagne">97€</span>
                  </div>
                  <p className="text-smoke text-xs mt-2">Paiement unique • Accès à vie</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer sécurité */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-mist text-sm">
            <Shield className="w-4 h-4 text-champagne/70" />
            <span>Paiement 100% sécurisé • Cryptage SSL • Données protégées par Stripe</span>
          </div>
        </div>
      </div>
    </main>
  )
}
