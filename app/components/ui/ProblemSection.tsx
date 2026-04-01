'use client'

import { XCircle } from 'lucide-react'
import SectionReveal from '../effects/SectionReveal'
import GlassCard from '../effects/GlassCard'

const pains = [
  "Tu regardes des vidéos YouTube depuis des mois, mais tu perds toujours de l'argent",
  "Tu as essayé 10 stratégies différentes, aucune ne marche vraiment",
  "Tu te sens seul devant tes graphiques, sans personne pour te guider",
  "Tu as cramé des comptes propfirm à cause du daily loss ou du revenge trading",
  "Tu comprends la théorie, mais en réel tu paniques et tu fais n'importe quoi",
]

export default function ProblemSection() {
  return (
    <section className="py-section relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <SectionReveal>
          <div className="reveal-child text-center mb-10 sm:mb-14">
            <h2 className="font-display text-display-lg mb-4">
              Tu te <em>reconnais</em> ?
            </h2>
            <p className="text-ivory-muted text-lg">
              Si tu ressens au moins une de ces frustrations, tu n'es pas seul.
            </p>
          </div>

          <div className="space-y-3">
            {pains.map((p, i) => (
              <div key={i} className="reveal-child">
                <GlassCard glowColor="rgba(239, 68, 68, 0.06)" className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <XCircle className="w-5 h-5 text-red-400/80 flex-shrink-0 mt-0.5" />
                    <p className="text-ivory-muted text-base leading-relaxed">{p}</p>
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
