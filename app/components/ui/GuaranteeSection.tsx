'use client'

import { Shield } from 'lucide-react'
import SectionReveal from '../effects/SectionReveal'

export default function GuaranteeSection() {
  return (
    <section className="py-section relative">
      <SectionReveal className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
        <div className="reveal-child">
          <Shield className="w-12 h-12 text-accent mx-auto mb-6 opacity-80" />
          <h2 className="font-display text-display-md mb-6 text-ivory">
            Prêt à passer au niveau supérieur ?
          </h2>
          <p className="text-xl text-ivory-muted mb-3 leading-relaxed">
            Rejoins <span className="text-accent font-medium">150+ membres</span> qui ont transformé leur trading.
          </p>
          <p className="text-ivory-dim text-base leading-relaxed">
            49€/mois, sans engagement, résiliable à tout moment.
          </p>
        </div>
      </SectionReveal>
    </section>
  )
}
