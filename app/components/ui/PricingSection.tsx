'use client'

import { CheckCircle, ArrowRight } from 'lucide-react'
import SectionReveal from '../effects/SectionReveal'
import GlassCard from '../effects/GlassCard'
import MagneticButton from '../effects/MagneticButton'
import { trackEvent } from '../../lib/posthog'
import { trackCheckoutInitiated } from '../../lib/analytics'

const included = [
  'Formation complète avancée (20+ heures)',
  'Communauté Discord privée',
  'Analyses de trades personnalisées',
]

export default function PricingSection() {
  return (
    <section className="py-section relative section-mesh">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <SectionReveal>
          <div className="reveal-child text-center mb-10 sm:mb-14">
            <p className="text-accent text-sm uppercase tracking-widest mb-4 font-medium">Tarifs</p>
            <h2 className="font-display text-display-lg">
              Choisis ton <em>accès</em>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5">
            {/* Monthly */}
            <div className="reveal-child">
              <GlassCard className="p-6 sm:p-8 h-full">
                <div className="relative z-10">
                  <h3 className="font-display text-xl mb-2 text-ivory">Mensuel</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display text-4xl text-ivory">49€</span>
                    <span className="text-ivory-dim text-sm">/mois</span>
                  </div>
                  <p className="text-ivory-ghost text-sm mb-8">Sans engagement, résiliable à tout moment</p>

                  <ul className="space-y-3 mb-8">
                    {included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-ivory-muted text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <MagneticButton
                    href="/checkout"
                    variant="secondary"
                    className="w-full"
                    onClick={() => { trackEvent('cta_clicked', { location: 'pricing_monthly' }); trackCheckoutInitiated() }}
                  >
                    Choisir mensuel
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </GlassCard>
            </div>

            {/* Annual — featured */}
            <div className="reveal-child">
              <GlassCard className="p-6 sm:p-8 h-full glass-accent relative">
                <span className="absolute -top-3 right-4 bg-accent text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide uppercase animate-float z-20">
                  -50%
                </span>
                <div className="relative z-10">
                  <h3 className="font-display text-xl mb-2 text-ivory">Annuel</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display text-4xl gradient-text-blue">24,50€</span>
                    <span className="text-ivory-dim text-sm">/mois</span>
                  </div>
                  <p className="text-ivory-ghost text-sm mb-8">
                    294€ facturé une fois <span className="line-through">588€</span>
                  </p>

                  <ul className="space-y-3 mb-8">
                    {[...included, "12 mois d'accès garanti"].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-ivory-muted text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <MagneticButton
                    href="/checkout"
                    variant="primary"
                    className="w-full"
                    onClick={() => { trackEvent('cta_clicked', { location: 'pricing_yearly' }); trackCheckoutInitiated() }}
                  >
                    Choisir annuel — Économise 294€
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>

                  <p className="text-center text-xs text-ivory-ghost mt-4">
                    95% de nos Funded Traders ont choisi cette formation
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Lifetime */}
            <div className="reveal-child">
              <GlassCard className="p-6 sm:p-8 h-full relative">
                <span className="absolute -top-3 right-4 bg-accent text-black text-[11px] font-bold px-3 py-1 rounded-full tracking-wide uppercase animate-float z-20">
                  BEST DEAL
                </span>
                <div className="relative z-10">
                  <h3 className="font-display text-xl mb-2 text-ivory">À vie</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display text-4xl text-ivory">588€</span>
                  </div>
                  <p className="text-ivory-ghost text-sm mb-8">Paiement unique — accès permanent</p>

                  <ul className="space-y-3 mb-8">
                    {[...included, 'Accès à vie, plus jamais de paiement', 'Toutes les futures mises à jour incluses'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-ivory-muted text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <MagneticButton
                    href="/checkout"
                    variant="secondary"
                    className="w-full"
                    onClick={() => { trackEvent('cta_clicked', { location: 'pricing_lifetime' }); trackCheckoutInitiated() }}
                  >
                    Choisir à vie
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </GlassCard>
            </div>
          </div>
        </SectionReveal>
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}
