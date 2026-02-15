'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Star
} from 'lucide-react'

// Hook pour détecter le scroll
function useScrollReveal() {
  const [revealed, setRevealed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, revealed }
}

// Particules simplifiées pour les pages secondaires
function SimpleParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${4 + Math.random() * 3}s`
  }))

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle particle-twinkle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration
          }}
        />
      ))}
    </div>
  )
}

// Background simplifié
function SimpleBackground() {
  return (
    <>
      <div className="animated-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="grid-lines" />
      <SimpleParticles />
      <div className="noise-overlay" />
    </>
  )
}

export default function FormationGratuitePage() {
  const section1 = useScrollReveal()
  const section2 = useScrollReveal()
  const section3 = useScrollReveal()
  const section4 = useScrollReveal()

  return (
    <main className="relative min-h-screen">
      <SimpleBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-void/80 backdrop-blur-xl border-b border-champagne/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image
                src="/logo-hvc-white.png"
                alt="High Value Capital"
                width={140}
                height={50}
                priority
              />
            </Link>
            <Link
              href="/"
              className="text-mist hover:text-champagne transition-colors text-sm"
            >
              ← Retour
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-up opacity-0 inline-flex items-center gap-2 bg-glass border border-champagne/20 rounded-full px-5 py-2.5 mb-8">
            <Sparkles className="w-4 h-4 text-champagne" />
            <span className="text-champagne text-sm font-medium">100% GRATUIT</span>
          </div>

          <h1 className="animate-fade-up delay-100 opacity-0 font-display text-4xl md:text-6xl lg:text-7xl font-medium mb-6 leading-[1.1]">
            Rejoins la{' '}
            <span className="italic text-gradient-gold">Formation Gratuite</span>
          </h1>

          <p className="animate-fade-up delay-200 opacity-0 text-xl text-mist mb-10 max-w-2xl mx-auto leading-relaxed">
            Découvre les fondamentaux du trading Forex et de la méthode ARD.
            Accède à une communauté de <span className="text-champagne">150+ traders</span> francophones actifs.
          </p>

          <div className="animate-fade-up delay-300 opacity-0 flex flex-wrap gap-6 justify-center items-center text-sm text-mist mb-10">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-champagne/70" />
              <span>150+ Membres</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-champagne/70" />
              <span>7+ Funded Traders</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-champagne/70" />
              <span>20k$+ Payouts</span>
            </div>
          </div>

          <div className="animate-fade-up delay-400 opacity-0">
            <a
              href="https://discord.gg/nwc8kbxSVt"
              className="btn-primary text-lg group inline-flex"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="flex items-center gap-2">
                Rejoindre le Discord HVC
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
            <p className="text-smoke text-sm mt-4">Aucune carte bancaire requise</p>
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* Ce que tu vas apprendre */}
      <section ref={section1.ref} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${section1.revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display text-3xl md:text-5xl font-medium mb-4">
              Ce que tu vas <span className="italic text-gradient-gold">apprendre</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Fondamentaux du Forex',
                description: 'Comprends les bases du marché Forex, les paires de devises, et comment fonctionnent les propfirms.'
              },
              {
                icon: TrendingUp,
                title: 'Méthode ARD',
                description: 'Introduction à la méthode ARD (ICT/SMC) : liquidité, market structure, et concepts clés.'
              },
              {
                icon: MessageCircle,
                title: 'Communauté Active',
                description: 'Accède à un serveur Discord privé avec des traders motivés qui partagent leurs résultats.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`card p-8 transition-all duration-700 ${
                  section1.revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="p-3 rounded-xl bg-champagne/10 w-fit mb-6">
                  <item.icon className="w-7 h-7 text-champagne" />
                </div>
                <h3 className="font-display text-2xl font-medium mb-3 text-ivory">{item.title}</h3>
                <p className="text-mist leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* Ce qui est inclus */}
      <section ref={section2.ref} className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${section2.revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display text-3xl md:text-5xl font-medium">
              Accès <span className="italic text-gradient-gold">100% Gratuit</span>
            </h2>
          </div>

          <div className={`card-highlight p-10 md:p-12 rounded-2xl transition-all duration-700 ${section2.revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Modules de formation', desc: 'Vidéos explicatives sur les concepts de base' },
                { title: 'Groupe communauté', desc: 'Échange avec 150+ traders actifs' },
                { title: 'Ressources gratuites', desc: 'PDFs, checklists, et outils trading' },
                { title: 'Support 24/7', desc: 'Pose tes questions dans le groupe' },
                { title: 'Analyses de marché', desc: 'Partages réguliers d\'analyses Forex' },
                { title: 'Lives & replays', desc: 'Sessions live et accès aux replays' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-champagne flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-ivory mb-1">{item.title}</h4>
                    <p className="text-mist text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="https://discord.gg/nwc8kbxSVt"
                className="btn-primary text-lg group inline-flex"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="flex items-center gap-2">
                  Rejoindre le Discord
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
              <p className="text-smoke text-sm mt-4">Pas de CB - Pas de spam - Acces instantane</p>
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* Résultats communauté */}
      <section ref={section3.ref} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${section3.revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 text-champagne text-sm uppercase tracking-widest mb-4">
              <Star className="w-4 h-4" />
              Résultats
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-medium mb-4">
              Nos membres <span className="italic text-gradient-gold">réussissent</span>
            </h2>
            <p className="text-mist max-w-2xl mx-auto">
              Rejoins une communauté qui génère des résultats réels.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: '7+', label: 'Funded Traders', sub: 'Certifiés par des propfirms' },
              { value: '20k$+', label: 'Payouts Générés', sub: 'Par nos membres actifs' },
              { value: '150+', label: 'Membres Actifs', sub: 'Communauté francophone' },
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center p-8 rounded-2xl bg-glass border border-champagne/10 transition-all duration-700 ${
                  section3.revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="font-display text-5xl font-medium text-gradient-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-ivory font-medium mb-1">{stat.label}</div>
                <div className="text-smoke text-sm">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* CTA Final */}
      <section ref={section4.ref} className="py-24 px-6">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${section4.revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-display text-3xl md:text-5xl font-medium mb-6">
            Prêt à démarrer ton{' '}
            <span className="italic text-gradient-gold">parcours trading</span> ?
          </h2>
          <p className="text-xl text-mist mb-10">
            Rejoins High Value Capital gratuitement et commence à apprendre dès aujourd'hui.
          </p>

          <a
            href="https://discord.gg/nwc8kbxSVt"
            className="btn-primary text-xl group inline-flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex items-center gap-2">
              Rejoindre le Discord HVC
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </a>

          <div className="mt-8 flex flex-wrap gap-6 justify-center items-center text-sm text-mist">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-champagne/70" />
              <span>100% Gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-champagne/70" />
              <span>Aucune CB requise</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-champagne/70" />
              <span>Accès immédiat</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-champagne/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-smoke text-sm">
          <p>© 2026 High Value Capital. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  )
}
