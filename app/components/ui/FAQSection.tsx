'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import SectionReveal from '../effects/SectionReveal'
import GlassCard from '../effects/GlassCard'

const faqs = [
  {
    q: "C'est quoi exactement la méthode ARD ?",
    a: "C'est la méthode ARD (Accumulation, Recharge, Distribution) — une approche qui permet de comprendre où les institutions placent leurs ordres. Au lieu de suivre des indicateurs en retard, tu apprends à lire le marché comme les pros.",
  },
  {
    q: 'Combien de temps avant de voir des résultats ?',
    a: "Ça dépend de ton engagement. Certains membres passent leurs premiers challenges en 3-6 mois. D'autres prennent plus de temps. L'important c'est de progresser chaque jour.",
  },
  {
    q: "J'ai déjà essayé d'autres formations, pourquoi celle-ci serait différente ?",
    a: "Parce qu'on a des résultats concrets : 15+ Funded Traders chez Alpha Capital, APEX et BlueberryFunded. 85k$+ de payouts documentés. Et surtout, une communauté active qui partage ses trades tous les jours.",
  },
  {
    q: 'Est-ce que ça marche pour les débutants complets ?',
    a: 'Oui. La formation part de zéro. Mais tu dois être prêt à apprendre et à pratiquer sérieusement.',
  },
  {
    q: "Je travaille à côté, j'ai pas beaucoup de temps...",
    a: "Beaucoup de nos membres ont un job. Tu peux trader la session London le soir ou te concentrer sur les setups daily/weekly. La méthode s'adapte à ton emploi du temps.",
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-section relative">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <SectionReveal>
          <div className="reveal-child text-center mb-10 sm:mb-14">
            <h2 className="font-display text-display-lg">
              Questions <em>fréquentes</em>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="reveal-child">
                <GlassCard className="overflow-hidden">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors relative z-10"
                    aria-expanded={open === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="text-ivory text-sm sm:text-base font-medium pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-ivory-dim flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    className={`overflow-hidden transition-all duration-300 ease-out ${open === i ? 'max-h-96' : 'max-h-0'}`}
                  >
                    <div className="px-5 pb-5 text-ivory-dim text-sm leading-relaxed relative z-10">
                      {faq.a}
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}
