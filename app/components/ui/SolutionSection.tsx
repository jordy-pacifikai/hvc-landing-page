'use client'

import { BookOpen, Users, Video, MessageCircle, BarChart3, TrendingUp } from 'lucide-react'
import SectionReveal from '../effects/SectionReveal'
import GlassCard from '../effects/GlassCard'

const features = [
  {
    icon: BookOpen,
    title: 'Formation complète',
    desc: 'Méthode ARD, zones de liquidité, manipulation, confluences — tout expliqué étape par étape.',
  },
  {
    icon: Users,
    title: 'Communauté active',
    desc: 'Un groupe de traders sur Discord. Partage de trades quotidien, analyses en temps réel.',
  },
  {
    icon: Video,
    title: 'Sessions live',
    desc: "Trades en direct, erreurs incluses. Tu apprends en regardant trader, pas en regardant des slides.",
  },
  {
    icon: MessageCircle,
    title: 'Suivi personnalisé',
    desc: 'Questions directes. Review de tes trades. Guidance adaptée à ton niveau.',
  },
  {
    icon: BarChart3,
    title: 'Journal & outils',
    desc: "Checklist pre-trade, journal de trading, templates de backtesting — tout ce qu'il te faut.",
  },
  {
    icon: TrendingUp,
    title: 'Résultats prouvés',
    desc: '15+ membres Certified Funded Traders. 85k$+ de payouts documentés.',
  },
]

export default function SolutionSection() {
  return (
    <section className="py-section relative section-mesh">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <SectionReveal>
          {/* Header */}
          <div className="reveal-child text-center mb-10 sm:mb-16">
            <p className="text-accent text-sm uppercase tracking-widest mb-4 font-medium">La Solution</p>
            <h2 className="font-display text-display-lg mb-6">
              High Value Capital
            </h2>
            <p className="text-ivory-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Une méthode structurée, une communauté active, et des résultats documentés.
              Tout ce qu&apos;il te faut pour passer tes challenges et décrocher tes premiers payouts.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="reveal-child">
                <GlassCard tilt className="p-6 sm:p-8 h-full">
                  <div className="relative z-10">
                    <div className="p-2.5 rounded-lg bg-accent-muted w-fit mb-5 group-hover:bg-accent/20 transition-colors">
                      <f.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display text-xl font-normal mb-2 text-ivory">{f.title}</h3>
                    <p className="text-ivory-dim text-sm leading-relaxed">{f.desc}</p>
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
