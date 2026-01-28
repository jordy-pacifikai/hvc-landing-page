'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  Award,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Quote,
  Users,
  CheckCircle
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

// Particules simplifiées
function SimpleParticles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
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

// Données des témoignages
const testimonials = [
  {
    name: 'Tauraa TEMAEVA',
    badge: 'Certified Funded Trader',
    propfirm: 'Alpha Capital Group',
    date: 'Octobre 2025',
    text: "Certified Funded Trader chez Alpha Capital Group. Merci à la team et @Jordy Banks pour les concepts qui m'ont permis de passer le challenge. La méthode ARD a vraiment changé ma façon de voir le marché.",
    highlight: true,
    category: 'funded'
  },
  {
    name: 'Flores Vista',
    badge: '10,000$ Payout',
    propfirm: 'Multiple Propfirms',
    date: 'En 1 mois',
    text: "En 6 mois avec HVC, j'ai passé mes challenges 5k, 50k, 100k et accumulé 10,000$ de payout. La communauté est au top, on s'entraide vraiment. Les lives de Jordy sont incroyables pour comprendre les setups en temps réel.",
    highlight: true,
    category: 'payout'
  },
  {
    name: 'Tehei MT',
    badge: 'Funded Trader',
    propfirm: 'Challenge Passed',
    date: 'Après 6 mois de grind',
    text: "We did it after 6 months of grind, thanks HVC beast! La persévérance et le suivi de la méthode paient toujours. Quand tu comprends vraiment les zones de liquidité, tout devient plus clair.",
    highlight: false,
    category: 'funded'
  },
  {
    name: 'Kehaulani Maruhi',
    badge: 'Admin/Funded',
    propfirm: 'APEX Futures',
    date: 'Octobre 2025',
    text: "Funded en futures sur APEX. Maintenant il faut sécuriser des payouts. Les concepts de liquidité marchent aussi sur les futures! La communauté HVC m'a vraiment aidé à progresser.",
    highlight: true,
    category: 'funded'
  },
  {
    name: 'Aro Sama',
    badge: 'Funded Trader',
    propfirm: 'BlueberryFunded',
    date: 'Septembre 2025',
    text: "Passé mon challenge BlueberryFunded grâce aux concepts appris dans la formation. La méthode est claire, les lives sont réguliers, et Jordy répond toujours à nos questions. Best investment ever.",
    highlight: false,
    category: 'funded'
  },
  {
    name: 'Piitau H',
    badge: 'En progression',
    propfirm: 'Challenge en cours',
    date: 'Novembre 2025',
    text: "Même si je n'ai pas encore passé mon challenge, ma compréhension du marché a complètement changé. Je ne trade plus à l'aveugle, je comprends pourquoi le prix bouge. C'est une question de temps maintenant.",
    highlight: false,
    category: 'progress'
  },
  {
    name: 'Hei Mana',
    badge: '5,000$ Payout',
    propfirm: 'Alpha Capital',
    date: 'Décembre 2025',
    text: "Premier payout de 5k$ reçu! Merci HVC pour la formation et le support. Les concepts de manipulation et de liquidité sont vraiment la clé. Je recommande à 100%.",
    highlight: true,
    category: 'payout'
  },
  {
    name: 'Teiki R.',
    badge: 'Funded Trader',
    propfirm: 'FTMO',
    date: 'Janvier 2026',
    text: "Challenge FTMO passé du premier coup après 4 mois de formation HVC. Le secret c'est de suivre la méthode à la lettre et de pratiquer sur les backtests. La communauté m'a vraiment motivé.",
    highlight: true,
    category: 'funded'
  }
]

// Stats
const stats = [
  { value: '7+', label: 'Funded Traders', icon: Award },
  { value: '20k$+', label: 'Payouts Documentés', icon: DollarSign },
  { value: '150+', label: 'Membres Actifs', icon: Users },
]

export default function TestimonialsPage() {
  const heroRef = useScrollReveal()
  const statsRef = useScrollReveal()
  const gridRef = useScrollReveal()
  const ctaRef = useScrollReveal()

  const [filter, setFilter] = useState<'all' | 'funded' | 'payout' | 'progress'>('all')

  const filteredTestimonials = filter === 'all'
    ? testimonials
    : testimonials.filter(t => t.category === filter)

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
      <section ref={heroRef.ref} className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-700 ${heroRef.revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 bg-glass border border-champagne/20 rounded-full px-5 py-2.5 mb-8">
              <Star className="w-4 h-4 text-champagne" />
              <span className="text-champagne text-sm font-medium">RÉSULTATS RÉELS</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium mb-6 leading-[1.1]">
              Ce qu'ils en{' '}
              <span className="italic text-gradient-gold">disent</span>
            </h1>

            <p className="text-xl text-mist mb-10 max-w-2xl mx-auto leading-relaxed">
              Des traders comme toi qui ont rejoint High Value Capital et obtenu des{' '}
              <span className="text-champagne">résultats concrets</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef.ref} className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-2xl bg-glass border border-champagne/10 transition-all duration-700 ${
                  statsRef.revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 text-champagne mx-auto mb-3" />
                <div className="font-display text-4xl font-medium text-gradient-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-mist text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* Filtres */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'funded', label: 'Funded Traders' },
              { key: 'payout', label: 'Payouts' },
              { key: 'progress', label: 'En progression' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as any)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  filter === f.key
                    ? 'bg-gradient-gold text-void'
                    : 'bg-glass border border-champagne/20 text-mist hover:text-champagne hover:border-champagne/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grille de témoignages */}
      <section ref={gridRef.ref} className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 transition-all duration-700 ${
                  testimonial.highlight
                    ? 'card-highlight glow-gold'
                    : 'card'
                } ${gridRef.revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${100 + index * 80}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-display text-xl font-medium text-ivory">
                      {testimonial.name}
                    </h3>
                    <p className="text-champagne text-sm mt-1">
                      {testimonial.propfirm} • {testimonial.date}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${
                    testimonial.category === 'payout'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : testimonial.category === 'funded'
                      ? 'bg-gradient-gold text-void'
                      : 'bg-champagne/10 text-champagne border border-champagne/20'
                  }`}>
                    {testimonial.badge}
                  </span>
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="absolute -top-2 -left-1 w-8 h-8 text-champagne/20" />
                  <p className="text-pearl leading-relaxed text-lg pl-6 italic">
                    {testimonial.text}
                  </p>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-champagne fill-champagne" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* CTA Final */}
      <section ref={ctaRef.ref} className="py-24 px-6">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${ctaRef.revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-display text-3xl md:text-5xl font-medium mb-6">
            Prêt à écrire{' '}
            <span className="italic text-gradient-gold">ton témoignage</span> ?
          </h2>
          <p className="text-xl text-mist mb-10">
            Rejoins High Value Capital et deviens le prochain Funded Trader.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/gratuit"
              className="btn-secondary text-lg"
            >
              <span>Commencer Gratuitement</span>
            </Link>
            <Link
              href="/checkout"
              className="btn-primary text-lg group"
            >
              <span className="flex items-center gap-2">
                Formation Premium - 97€
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 justify-center items-center text-sm text-mist">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-champagne/70" />
              <span>Garantie 7 jours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-champagne/70" />
              <span>Accès à vie</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-champagne/70" />
              <span>Communauté active</span>
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
