'use client'

import { Suspense, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, ArrowLeft, CheckCircle, Shield, Zap, CreditCard } from 'lucide-react'
import { PayPalScriptProvider, PayPalButtons, FUNDING } from '@paypal/react-paypal-js'

const COMMUNITY_API = 'https://community.highvaluecapital.club/api/paypal'
const PAYPAL_CLIENT_ID = 'ASvt7ImCDztqbX6HPpcVgPcHDf2tdquGLLFuH_KQlZ1uQq-aEtGYdHRUkRcrdFCJOpWOtcRNSz_rU12l'

type Plan = 'monthly' | 'yearly'

const PLANS = {
  monthly: { label: '1 mois', price: 49, perMonth: 49 },
  yearly: { label: '12 mois', price: 294, perMonth: 24.5 },
} as const

function PaymentButtons({ plan, onSuccess }: { plan: Plan; onSuccess: () => void }) {
  const [activating, setActivating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateOrder = async () => {
    setError(null)
    const res = await fetch(`${COMMUNITY_API}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (!res.ok || !data.id) {
      throw new Error(data.error || 'Erreur creation commande')
    }
    return data.id
  }

  const handleApprove = async (data: { orderID: string }) => {
    setActivating(true)
    setError(null)
    try {
      const res = await fetch(`${COMMUNITY_API}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: data.orderID }),
      })
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || 'Erreur activation')
      }
      onSuccess()
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'activation")
      setActivating(false)
    }
  }

  if (activating) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
        <span className="ml-3 text-ivory-muted text-sm">Activation de ton abonnement...</span>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}
      <div className="bg-white rounded-xl p-4">
        <PayPalScriptProvider
          options={{
            clientId: PAYPAL_CLIENT_ID,
            currency: 'EUR',
            intent: 'capture',
            locale: 'fr_FR',
            components: 'buttons',
          }}
        >
          {/* Bouton Carte Bancaire */}
          <PayPalButtons
            key={`card-${plan}`}
            fundingSource={FUNDING.CARD}
            style={{
              layout: 'vertical',
              color: 'black',
              shape: 'rect',
              label: 'pay',
              height: 50,
            }}
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onError={(err) => {
              console.error('PayPal card error:', err)
              setError('Erreur de paiement. Veuillez reessayer.')
            }}
            onCancel={() => setError(null)}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  )
}

function CheckoutContent() {
  const [plan, setPlan] = useState<Plan>('monthly')
  const [success, setSuccess] = useState(false)

  const currentPlan = PLANS[plan]

  if (success) {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <div className="noise-overlay" />
        <div className="relative z-10 max-w-lg w-full text-center">
          <div className="card-accent p-8 md:p-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-medium text-ivory mb-4">Paiement confirme !</h2>
            <p className="text-ivory-muted mb-6">
              Ton acces Premium est active. Connecte-toi avec ton email PayPal pour acceder a la formation.
            </p>
            <a
              href="https://community.highvaluecapital.club/login"
              className="btn-primary"
            >
              Se connecter
            </a>
          </div>
        </div>
      </main>
    )
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
            Formation Trading <span className="italic text-accent-gradient">Premium</span>
          </h1>
          <p className="text-ivory-muted">Paiement securise</p>
        </div>

        {/* Card principale */}
        <div className="bg-black-card border border-black-border rounded-2xl p-8 md:p-12">
          <div>
            <h3 className="font-display text-lg font-medium mb-5 flex items-center gap-2 text-ivory">
              <Zap className="w-5 h-5 text-accent" />
              Ce que tu vas recevoir
            </h3>
            <ul className="space-y-3">
              {[
                'Acces complet a la formation ARD (7+ modules)',
                'Groupe prive Premium sur Discord',
                'Lives hebdomadaires exclusifs',
                'Support communaute active 24/7',
                'Sans engagement, resiliable a tout moment',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-ivory-muted">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Plan toggle */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                onClick={() => setPlan('monthly')}
                className={`relative p-4 rounded-xl border transition-all text-left ${
                  plan === 'monthly'
                    ? 'border-accent bg-accent/10'
                    : 'border-black-border hover:border-black-hover'
                }`}
              >
                <p className="text-sm text-ivory-dim mb-1">Mensuel</p>
                <p className="font-display text-2xl font-medium text-ivory">49&euro;<span className="text-sm text-ivory-dim">/mois</span></p>
              </button>
              <button
                onClick={() => setPlan('yearly')}
                className={`relative p-4 rounded-xl border transition-all text-left ${
                  plan === 'yearly'
                    ? 'border-accent bg-accent/10'
                    : 'border-black-border hover:border-black-hover'
                }`}
              >
                <span className="absolute -top-2.5 right-3 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  -50%
                </span>
                <p className="text-sm text-ivory-dim mb-1">Annuel</p>
                <p className="font-display text-2xl font-medium text-ivory">24.50&euro;<span className="text-sm text-ivory-dim">/mois</span></p>
                <p className="text-xs text-ivory-dim mt-1">294&euro; facture une fois</p>
              </button>
            </div>

            {/* Prix recap */}
            <div className="mt-4 p-5 bg-black-elevated border border-accent/20 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-ivory-muted">Total</span>
                <span className="font-display text-3xl font-medium text-accent">
                  {currentPlan.price}&euro;
                  {plan === 'monthly' && <span className="text-lg">/mois</span>}
                </span>
              </div>
              <p className="text-ivory-dim text-xs mt-2">
                {plan === 'monthly'
                  ? 'Sans engagement - Resiliable a tout moment'
                  : '12 mois d\'acces - Soit 24.50\u20ac/mois au lieu de 49\u20ac'}
              </p>
            </div>

            {/* Payment */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-accent" />
                <span className="text-ivory font-medium">Choisir un mode de paiement</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-ivory-ghost" />
                  <span className="text-ivory-ghost text-xs">SSL</span>
                </div>
              </div>
              <PaymentButtons key={plan} plan={plan} onSuccess={() => setSuccess(true)} />
              <div className="flex items-center justify-center gap-4 mt-4 opacity-50">
                <svg viewBox="0 0 48 32" className="h-6" fill="none"><rect width="48" height="32" rx="4" fill="#1A1F71"/><path d="M19.5 21h-3l1.9-11h3l-1.9 11zm12.8-10.7c-.6-.2-1.5-.5-2.7-.5-3 0-5.1 1.5-5.1 3.7 0 1.6 1.5 2.5 2.6 3.1 1.1.5 1.5.9 1.5 1.4 0 .7-.9 1.1-1.7 1.1-1.1 0-1.8-.2-2.7-.5l-.4-.2-.4 2.4c.7.3 1.9.6 3.2.6 3.2 0 5.2-1.5 5.2-3.8 0-1.3-.8-2.2-2.5-3-1-.5-1.7-.9-1.7-1.4 0-.5.5-1 1.7-1 1 0 1.7.2 2.2.4l.3.1.5-2.4zm7.9-.3h-2.3c-.7 0-1.3.2-1.6 1l-4.5 10h3.2l.6-1.7h3.9l.4 1.7h2.8l-2.5-11zm-3.7 7.1l1.6-4.2.9 4.2h-2.5zM16.3 10l-3 7.5-.3-1.5c-.5-1.8-2.2-3.8-4.1-4.8l2.7 9.8h3.2l4.8-11h-3.3z" fill="#fff"/><path d="M10.5 10H5.8l-.1.3c3.8.9 6.3 3.2 7.3 5.9l-1-5.1c-.2-.8-.7-1-1.5-1.1z" fill="#F9A533"/></svg>
                <svg viewBox="0 0 48 32" className="h-6" fill="none"><rect width="48" height="32" rx="4" fill="#252525"/><circle cx="19" cy="16" r="8" fill="#EB001B"/><circle cx="29" cy="16" r="8" fill="#F79E1B"/><path d="M24 10.3a8 8 0 010 11.4 8 8 0 000-11.4z" fill="#FF5F00"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer securite + connexion */}
        <div className="text-center mt-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-ivory-dim text-sm">
            <Shield className="w-4 h-4 text-accent/50" />
            <span>Paiement 100% securise - Donnees protegees</span>
          </div>
          <p className="text-ivory-dim text-sm">
            Deja membre ?{' '}
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
