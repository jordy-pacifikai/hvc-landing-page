'use client'

import { Suspense, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, ArrowLeft, CheckCircle, Shield, Zap, CreditCard } from 'lucide-react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

const COMMUNITY_API = 'https://community.highvaluecapital.club/api/paypal'
const PAYPAL_CLIENT_ID = 'ASvt7ImCDztqbX6HPpcVgPcHDf2tdquGLLFuH_KQlZ1uQq-aEtGYdHRUkRcrdFCJOpWOtcRNSz_rU12l'

type Plan = 'monthly' | 'yearly'

const PLANS = {
  monthly: { label: '1 mois', price: 49, perMonth: 49, badge: null },
  yearly: { label: '12 mois', price: 294, perMonth: 24.5, badge: '-50%' },
} as const

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

function CheckoutContent() {
  const [plan, setPlan] = useState<Plan>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const currentPlan = PLANS[plan]

  const createOrder = useCallback(async () => {
    const res = await fetch(`${COMMUNITY_API}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (!res.ok || !data.id) {
      throw new Error(data.error || 'Erreur lors de la creation')
    }
    return data.id
  }, [plan])

  const onApprove = useCallback(async (data: { orderID: string }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${COMMUNITY_API}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: data.orderID }),
      })
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || 'Erreur lors de l\'activation')
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du paiement')
    } finally {
      setLoading(false)
    }
  }, [])

  const onError = useCallback((err: Record<string, unknown>) => {
    console.error('PayPal error:', err)
    setError('Une erreur est survenue lors du paiement. Veuillez reessayer.')
    setLoading(false)
  }, [])

  if (success) {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <SimpleBackground />
        <div className="relative z-10 max-w-lg w-full text-center">
          <div className="card-highlight p-8 md:p-12 rounded-2xl glow-gold">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-medium text-ivory mb-4">Paiement confirme !</h2>
            <p className="text-pearl mb-6">
              Ton acces Premium est active. Connecte-toi avec ton email PayPal pour acceder a la formation.
            </p>
            <a
              href="https://community.highvaluecapital.club/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-champagne to-gold text-obsidian py-3 px-8 rounded-xl font-display font-semibold hover:shadow-lg hover:shadow-champagne/20 transition-all"
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
          <p className="text-mist">Paiement securise</p>
        </div>

        {/* Card principale */}
        <div className="card-highlight p-8 md:p-12 rounded-2xl glow-gold">
          {error && (
            <div className="text-center py-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <h3 className="font-display text-lg font-medium mb-5 flex items-center gap-2 text-ivory">
              <Zap className="w-5 h-5 text-champagne" />
              Ce que tu vas recevoir
            </h3>
            <ul className="space-y-3">
              {[
                'Acces complet a la formation ARD (7+ modules)',
                'Groupe prive Premium sur Discord',
                'Lives hebdomadaires exclusifs',
                'Support communaute active 24/7',
                'Garantie satisfait ou rembourse 7 jours',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-pearl">
                  <CheckCircle className="w-5 h-5 text-champagne flex-shrink-0 mt-0.5" />
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
                    ? 'border-champagne bg-champagne/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <p className="text-sm text-mist mb-1">Mensuel</p>
                <p className="font-display text-2xl font-medium text-ivory">49&euro;<span className="text-sm text-mist">/mois</span></p>
              </button>
              <button
                onClick={() => setPlan('yearly')}
                className={`relative p-4 rounded-xl border transition-all text-left ${
                  plan === 'yearly'
                    ? 'border-champagne bg-champagne/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-champagne to-gold text-obsidian text-xs font-bold px-2 py-0.5 rounded-full">
                  -50%
                </span>
                <p className="text-sm text-mist mb-1">Annuel</p>
                <p className="font-display text-2xl font-medium text-ivory">24.50&euro;<span className="text-sm text-mist">/mois</span></p>
                <p className="text-xs text-mist mt-1">294&euro; facture une fois</p>
              </button>
            </div>

            {/* Prix recap */}
            <div className="mt-4 p-5 bg-glass border border-champagne/20 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-mist">Total</span>
                <span className="font-display text-3xl font-medium text-champagne">
                  {currentPlan.price}&euro;
                  {plan === 'monthly' && <span className="text-lg">/mois</span>}
                </span>
              </div>
              <p className="text-smoke text-xs mt-2">
                {plan === 'monthly'
                  ? 'Sans engagement - Resiliable a tout moment'
                  : '12 mois d\'acces - Soit 24.50\u20ac/mois au lieu de 49\u20ac'}
              </p>
            </div>

            {/* Payment section */}
            <div className="mt-8">
              <h3 className="font-display text-base font-medium mb-4 flex items-center gap-2 text-ivory">
                <CreditCard className="w-5 h-5 text-champagne" />
                Paiement par carte bancaire
              </h3>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-champagne" />
                  <span className="ml-3 text-mist text-sm">Traitement en cours...</span>
                </div>
              ) : (
                <div className="bg-white/80 rounded-xl p-4">
                  <PayPalScriptProvider
                    options={{
                      clientId: PAYPAL_CLIENT_ID,
                      components: 'buttons',
                      currency: 'EUR',
                      intent: 'capture',
                      locale: 'fr_FR',
                    }}
                  >
                    <PayPalButtons
                      key={plan}
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                      fundingSource="card"
                      style={{
                        color: 'black',
                        shape: 'rect',
                        label: 'pay',
                        height: 55,
                        layout: 'vertical',
                        tagline: false,
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer securite */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-mist text-sm">
            <Shield className="w-4 h-4 text-champagne/70" />
            <span>Paiement 100% securise par PayPal - Donnees protegees</span>
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
