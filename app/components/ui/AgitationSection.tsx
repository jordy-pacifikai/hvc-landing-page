'use client'

import SectionReveal from '../effects/SectionReveal'

export default function AgitationSection() {
  return (
    <section className="py-section relative">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <SectionReveal>
          <div className="reveal-child">
            <h2 className="font-display text-display-lg mb-12">
              Et si <em>rien</em> ne change...
            </h2>
          </div>

          <div className="reveal-child relative glass p-8 sm:p-12 md:p-16">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-accent/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-accent/30 rounded-br-2xl" />

            <p className="text-xl sm:text-2xl text-ivory mb-8 font-light leading-relaxed">
              Chaque jour qui passe, tu perds du temps et de l&apos;argent.
            </p>
            <p className="text-ivory-muted text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Pendant que tu tournes en rond avec des stratégies trouvées sur internet,
              d&apos;autres traders passent leurs challenges et reçoivent leurs premiers payouts.
            </p>

            <div className="w-16 h-px bg-accent/30 mx-auto mb-10" />

            <p className="font-display text-display-md gradient-text-blue mb-4">
              <em>La différence entre eux et toi ?</em>
            </p>
            <p className="text-lg text-ivory font-medium">
              Ils ont un mentor. Une méthode claire. Une communauté qui les pousse.
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
