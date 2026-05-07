'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Shield, Zap, Crown, Star, PartyPopper } from 'lucide-react'

const FREEMIUS_PLAN_ID = 44683

// Lazy SDK loader — instantiated only on first click (avoids hydration side-effects)
type FsCheckout = {
  open: (opts: Record<string, unknown>) => void
  close: () => void
}
let checkoutInstance: FsCheckout | null = null
let sdkPromise: Promise<FsCheckout> | null = null

function getCheckout(): Promise<FsCheckout> {
  if (checkoutInstance) return Promise.resolve(checkoutInstance)
  if (sdkPromise) return sdkPromise
  sdkPromise = import('@freemius/checkout').then(({ Checkout: CheckoutClass }) => {
    checkoutInstance = new CheckoutClass({
      product_id: Number(process.env.NEXT_PUBLIC_FREEMIUS_PRODUCT_ID ?? '26997'),
      public_key: process.env.NEXT_PUBLIC_FREEMIUS_PUBLIC_KEY ?? 'pk_03572c613cb51e929178f3788e308',
    }) as FsCheckout
    return checkoutInstance
  })
  return sdkPromise
}

const plans = [
  {
    id: 'monthly' as const,
    name: 'Mensuel',
    price: 49,
    period: '/mois',
    subtitle: 'Sans engagement',
    badge: null,
    savings: null,
  },
  {
    id: 'annual' as const,
    name: 'Annuel',
    price: 294,
    period: '/an',
    subtitle: 'Soit 24,50\u20AC/mois',
    badge: '-50%',
    savings: '\u00C9conomise 294\u20AC',
  },
  {
    id: 'lifetime' as const,
    name: '\u00C0 vie',
    price: 588,
    period: '',
    subtitle: 'Paiement unique',
    badge: 'BEST DEAL',
    savings: 'Acc\u00e8s permanent',
  },
]

function CheckoutContent() {
  const [selected, setSelected] = useState<'monthly' | 'annual' | 'lifetime'>('annual')
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(false)
  const paidRef = useRef(setPaid)
  paidRef.current = setPaid

  const handleCheckout = useCallback(async () => {
    setLoading(true)
    try {
      const checkout = await getCheckout()
      checkout.open({
        plan_id: FREEMIUS_PLAN_ID,
        billing_cycle: selected,
        licenses: 1,
        currency: 'eur',
        success: () => { paidRef.current(true) },
        afterClose: () => { setLoading(false) },
      })
    } catch (err) {
      console.error('[checkout] open failed', err)
      setLoading(false)
    }
  }, [selected])

  if (paid) {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <div className="noise-overlay" />
        <div className="relative z-10 max-w-lg w-full text-center">
          <PartyPopper className="w-16 h-16 text-accent mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold mb-4 text-ivory">Paiement confirm&eacute; !</h1>
          <p className="text-ivory-muted mb-8">
            Tu vas recevoir un email avec tes acc&egrave;s. Connecte-toi pour acc&eacute;der &agrave; la plateforme.
          </p>
          <button
            type="button"
            onClick={() => { window.location.href = 'https://community.highvaluecapital.club/login' }}
            className="bg-accent hover:bg-accent/90 text-black font-bold py-3.5 px-8 rounded-xl text-base transition-all"
          >
            Se connecter
          </button>
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
            Rejoins la communaut&eacute; <span className="italic text-accent-gradient">HVC</span>
          </h1>
          <p className="text-ivory-muted max-w-md mx-auto">
            Acc&egrave;de &agrave; la formation, aux analyses, au journal IA et au r&eacute;seau de traders les plus ambitieux.
          </p>
        </div>

        {/* Card principale */}
        <div className="bg-black-card border border-black-border rounded-2xl p-8 md:p-12">
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
                { icon: CheckCircle, text: 'Syst\u00e8me de gamification et r\u00e9compenses' },
                { icon: CheckCircle, text: 'Giveaways hebdomadaires exclusifs' },
                { icon: CheckCircle, text: 'Garantie satisfait ou rembours\u00e9 7 jours' },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-ivory-muted">
                  <item.icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plan selector */}
          <div className="space-y-3 mb-6">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                className={`w-full p-4 rounded-xl border transition-all text-left relative ${
                  selected === plan.id
                    ? 'border-accent bg-accent/10 ring-2 ring-accent/30'
                    : 'border-black-border hover:border-ivory-dim/30 bg-black-elevated'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent text-black">
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selected === plan.id ? 'border-accent' : 'border-ivory-dim/40'
                      }`}
                    >
                      {selected === plan.id && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                    </div>
                    <div>
                      <span className="font-bold text-ivory">{plan.name}</span>
                      {plan.savings && (
                        <span className="ml-2 text-xs text-accent">{plan.savings}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-2xl font-bold text-ivory">
                      {plan.price}&euro;
                    </span>
                    <span className="text-ivory-muted text-sm">{plan.period}</span>
                  </div>
                </div>
                <p className="text-ivory-dim text-xs mt-1 ml-8">{plan.subtitle}</p>
              </button>
            ))}
          </div>

          {/* Checkout button */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-accent hover:bg-accent/90 disabled:opacity-60 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
          >
            {loading ? 'Chargement...' : 'Rejoindre maintenant'}
          </button>

          {selected === 'lifetime' && (
            <p className="text-accent text-sm text-center mt-3 flex items-center justify-center gap-2">
              <Star className="w-4 h-4" />
              Acc&egrave;s &agrave; vie &mdash; plus jamais de paiement
            </p>
          )}

          <p className="text-ivory-dim text-xs text-center mt-4">
            Paiement 100% s&eacute;curis&eacute; via Freemius
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-ivory-dim text-sm">
            <Shield className="w-4 h-4 text-accent/50" />
            <span>Paiement 100% s&eacute;curis&eacute; &mdash; Donn&eacute;es prot&eacute;g&eacute;es</span>
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
  return <CheckoutContent />
}
