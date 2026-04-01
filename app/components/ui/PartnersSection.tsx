'use client'

import Image from 'next/image'
import SectionReveal from '../effects/SectionReveal'
import { trackEvent } from '../../lib/posthog'

const partners = [
  {
    name: 'StarTrader',
    logo: '/logo-startrader.png',
    width: 50,
    height: 50,
    url: 'https://client.startrader.com/sign-up?ib=54662',
    promo: 'Broker forex regulé',
  },
  {
    name: 'Blueberry Funded',
    logo: '/logo-blueberry.png',
    width: 160,
    height: 40,
    url: 'https://blueberryfunded.com/?utm_source=affiliate&campaign=highvaluecapital&ref=32',
    promo: 'Code HVC30 — 30% off',
  },
  {
    name: 'FX Replay',
    logo: '/logo-fxreplay.png',
    width: 140,
    height: 40,
    url: 'https://www.fxreplay.com/?utm_campaign=affiliate_program&utm_medium=affiliate&utm_source=rewardful&via=hvc',
    promo: 'Code JORDYBANKS — 15% off',
  },
]

export default function PartnersSection() {
  return (
    <section className="py-16 sm:py-20 relative">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <SectionReveal>
          <div className="reveal-child text-center mb-10">
            <p className="text-accent text-sm uppercase tracking-widest mb-3 font-medium">Partenaires officiels</p>
            <p className="text-ivory-muted text-base">
              Les outils que nous utilisons et recommandons — avec des codes promo exclusifs.
            </p>
          </div>

          <div className="reveal-child flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16">
            {partners.map((p, i) => (
              <a
                key={i}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2.5 transition-all"
                onClick={() => trackEvent('partner_clicked', { partner: p.name })}
              >
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={p.width}
                  height={p.height}
                  className="w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ height: p.height, maxWidth: p.width }}
                />
                <span className="text-ivory-dim text-xs tracking-wide group-hover:text-accent transition-colors duration-300">
                  {p.promo}
                </span>
              </a>
            ))}
          </div>
        </SectionReveal>
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}
