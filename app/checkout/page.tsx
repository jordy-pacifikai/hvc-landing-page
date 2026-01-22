'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'

const stripePromise = loadStripe('pk_live_51QaiinDFDOh4UH0dImQcweObLWJQT3NY7jA9lVI1mp8NzH2p9RhHzNzubGF65zDSdT9z3AEZZgj2S7qm39z4DdoY003pR0EYJh')

export default function CheckoutPage() {
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return data.clientSecret
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Une erreur est survenue')
      throw err
    }
  }, [])

  const options = { fetchClientSecret }

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-4">
      <div className="max-w-4xl mx-auto">
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

        {error ? (
          <div className="bg-hvc-dark/50 border border-hvc-gold/20 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
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
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar - Informations produit */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-hvc-dark/50 border border-hvc-gold/20 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-hvc-gold" />
                  Ce que tu vas recevoir
                </h3>
                <ul className="space-y-3 text-gray-300 text-sm">
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
            </div>

            {/* Formulaire Stripe Embedded */}
            <div className="md:col-span-2">
              <div className="bg-hvc-dark/50 border border-hvc-gold/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={options}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            </div>
          </div>
        )}

        {/* Footer sécurité */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>🔒 Paiement 100% sécurisé • Cryptage SSL • Données protégées par Stripe</p>
        </div>
      </div>
    </div>
  )
}
