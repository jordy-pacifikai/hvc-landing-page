'use client'

import { ArrowRight } from 'lucide-react'
import SectionReveal from '../effects/SectionReveal'
import GlassCard from '../effects/GlassCard'
import { trackEvent } from '../../lib/posthog'

const items = [
  {
    name: 'Tauraa TEMAEVA',
    badge: 'Funded Trader',
    result: 'Alpha Capital — Oct 2025',
    text: "Certified Funded Trader chez Alpha Capital Group. Merci à la team et @Jordy Banks pour les concepts qui m'ont permis de passer le challenge.",
    highlight: true,
  },
  {
    name: 'Flores Vista',
    badge: '10,000$ Payout',
    result: 'En 1 mois',
    text: "En 6 mois avec HVC, j'ai passé mes challenges 5k, 50k, 100k et accumulé 10,000$ de payout. Communauté au top.",
    highlight: true,
  },
  {
    name: 'Tehei MT',
    badge: 'Funded',
    result: '6 mois de grind',
    text: 'We did it after 6 months of grind, thanks HVC beast! La persévérance et le suivi de la méthode paient toujours.',
    highlight: false,
  },
  {
    name: 'Kehaulani Maruhi',
    badge: 'Admin/Funded',
    result: 'APEX Futures — Oct 2025',
    text: 'Funded en futures sur APEX. Maintenant il faut sécuriser des payouts. Les concepts de liquidité marchent aussi sur les futures!',
    highlight: true,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-section relative">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <SectionReveal>
          <div className="reveal-child text-center mb-10 sm:mb-14">
            <p className="text-accent text-sm uppercase tracking-widest mb-4 font-medium">Témoignages</p>
            <h2 className="font-display text-display-lg mb-4">
              Ce qu&apos;ils en <em>disent</em>
            </h2>
            <p className="text-ivory-muted text-lg">Résultats réels de traders comme toi</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {items.map((t, i) => (
              <div key={i} className="reveal-child">
                <GlassCard className={`p-6 sm:p-8 h-full ${t.highlight ? 'glass-accent' : ''}`}>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="min-w-0">
                        <h4 className="font-display text-lg text-ivory">{t.name}</h4>
                        <p className="text-accent text-sm mt-0.5">{t.result}</p>
                      </div>
                      <span className="bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                        {t.badge}
                      </span>
                    </div>
                    <p className="text-ivory-muted leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>

          <div className="reveal-child text-center mt-10">
            <a
              href="/temoignages"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors text-sm font-medium group"
              onClick={() => trackEvent('testimonials_see_all_clicked')}
            >
              Voir tous les témoignages
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
