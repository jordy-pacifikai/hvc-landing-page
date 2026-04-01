'use client'

import { ArrowRight } from 'lucide-react'
import SectionReveal from '../effects/SectionReveal'
import MagneticButton from '../effects/MagneticButton'
import { trackEvent } from '../../lib/posthog'
import { trackCheckoutInitiated } from '../../lib/analytics'

export default function FinalCTASection() {
  return (
    <section className="py-section relative cta-mesh">
      <SectionReveal className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <div className="reveal-child">
          <h2 className="font-display text-display-lg mb-4">
            Arrête de <em>galérer</em> seul.
          </h2>
        </div>
        <div className="reveal-child">
          <p className="font-display text-display-md gradient-text-blue mb-10">
            <em>Rejoins une communauté qui obtient des résultats.</em>
          </p>
        </div>
        <div className="reveal-child">
          <p className="text-ivory-muted text-base sm:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Continuer à chercher sur YouTube, ou rejoindre High Value Capital
            et avoir un mentor jusqu&apos;à ton premier payout.
          </p>
        </div>
        <div className="reveal-child">
          <MagneticButton
            href="/checkout"
            variant="primary"
            className="text-base"
            onClick={() => { trackEvent('cta_clicked', { location: 'footer' }); trackCheckoutInitiated() }}
          >
            Rejoindre HVC — dès 24,50€/mois
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </SectionReveal>
    </section>
  )
}
