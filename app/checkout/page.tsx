'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

declare global {
  interface Window {
    Stripe?: any
  }
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Charger Stripe.js
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

      // Créer la session checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
      })

      const { sessionId, error: sessionError } = await response.json()

      if (sessionError) {
        throw new Error(sessionError)
      }

      // Rediriger vers Stripe Checkout
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
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-hvc-gold transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>

          <Image
            src="/logo-hvc-white.png"
            alt="High Value Capital"
            width={200}
            height={72}
            className="mx-auto mb-6"
          />

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Formation Trading <span className="text-gradient">Premium</span>
          </h1>
          <p className="text-gray-400">Paiement sécurisé par Stripe</p>
        </div>

        {/* Card */}
        <div className="bg-hvc-dark/50 border border-hvc-gold/20 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          {loading && !error && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-hvc-gold mx-auto mb-4 animate-spin" />
              <p className="text-gray-300 text-lg">Redirection vers le paiement sécurisé...</p>
              <p className="text-gray-500 text-sm mt-2">Veuillez patienter quelques secondes</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-gold text-hvc-dark font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à l'accueil
              </Link>
            </div>
          )}

          {/* Informations produit pendant le chargement */}
          {loading && !error && (
            <div className="mt-8 pt-8 border-t border-hvc-gold/10">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-hvc-gold" />
                Ce que tu vas recevoir
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-hvc-gold mt-1">✓</span>
                  <span>Accès complet à la formation ARD (7+ modules)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-hvc-gold mt-1">✓</span>
                  <span>Groupe privé Premium sur Heartbeat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-hvc-gold mt-1">✓</span>
                  <span>Lives hebdomadaires exclusifs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-hvc-gold mt-1">✓</span>
                  <span>Support communauté active 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-hvc-gold mt-1">✓</span>
                  <span>Garantie satisfait ou remboursé 7 jours</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-hvc-gold/5 border border-hvc-gold/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Prix</span>
                  <span className="text-2xl font-bold text-hvc-gold">97€</span>
                </div>
                <p className="text-gray-500 text-xs mt-2">Paiement unique • Accès à vie</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer sécurité */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>🔒 Paiement 100% sécurisé • Cryptage SSL • Données protégées par Stripe</p>
        </div>
      </div>
    </div>
  )
}
