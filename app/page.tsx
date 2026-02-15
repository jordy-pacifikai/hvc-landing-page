'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  MessageCircle,
  Video,
  FileText,
  Shield,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react'

// URLs
const URLS = {
  discord: 'https://discord.gg/nwc8kbxSVt',
  premium: '/checkout',
  testimonials: '/temoignages'
}

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

// Composant pour les particules animées avec différents types
function Particles() {
  // Particules qui scintillent
  const twinkleParticles = Array.from({ length: 40 }, (_, i) => ({
    id: `twinkle-${i}`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${4 + Math.random() * 3}s`,
    size: `${1.5 + Math.random() * 2}px`
  }))

  // Particules qui flottent
  const floatParticles = Array.from({ length: 20 }, (_, i) => ({
    id: `float-${i}`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 15}s`,
    duration: `${12 + Math.random() * 8}s`,
    size: `${2 + Math.random() * 2}px`
  }))

  // Particules qui dérivent vers le haut
  const driftParticles = Array.from({ length: 15 }, (_, i) => ({
    id: `drift-${i}`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 20}s`,
    duration: `${18 + Math.random() * 10}s`,
    size: `${1 + Math.random() * 2}px`
  }))

  return (
    <div className="particles">
      {twinkleParticles.map((p) => (
        <div
          key={p.id}
          className="particle particle-twinkle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size
          }}
        />
      ))}
      {floatParticles.map((p) => (
        <div
          key={p.id}
          className="particle particle-float"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size
          }}
        />
      ))}
      {driftParticles.map((p) => (
        <div
          key={p.id}
          className="particle particle-drift"
          style={{
            left: p.left,
            bottom: 0,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size
          }}
        />
      ))}
    </div>
  )
}

// Étoiles filantes occasionnelles
function ShootingStars() {
  const stars = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    top: `${10 + Math.random() * 40}%`,
    left: `${Math.random() * 60}%`,
    delay: `${i * 8 + Math.random() * 5}s`,
    duration: `${2 + Math.random()}s`
  }))

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: star.top,
            left: star.left,
            animationName: 'shootingStar',
            animationDelay: star.delay,
            animationDuration: star.duration,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-out'
          }}
        />
      ))}
    </>
  )
}

// Background animé avec plus d'effets
function AnimatedBackground() {
  return (
    <>
      <div className="animated-bg">
        {/* Orbes flottants */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="orb orb-5" />

        {/* Rayons de lumière */}
        <div className="light-beam light-beam-1" />
        <div className="light-beam light-beam-2" />
        <div className="light-beam light-beam-3" />

        {/* Vagues fluides */}
        <div className="wave-container">
          <div className="wave wave-1" />
          <div className="wave wave-2" />
          <div className="wave wave-3" />
        </div>

        {/* Anneaux de pulse */}
        <div className="pulse-ring pulse-ring-1" />
        <div className="pulse-ring pulse-ring-2" />
        <div className="pulse-ring pulse-ring-3" />
      </div>

      {/* Grille avec respiration */}
      <div className="grid-lines" />

      {/* Particules multi-types */}
      <Particles />

      {/* Étoiles filantes */}
      <ShootingStars />

      {/* Texture noise */}
      <div className="noise-overlay" />
    </>
  )
}

// Composant Hero
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        {/* Badge animé */}
        <div className="animate-fade-up opacity-0 inline-flex items-center gap-3 bg-glass border border-champagne/20 rounded-full px-5 py-2.5 mb-10">
          <div className="relative">
            <Award className="w-5 h-5 text-champagne" />
            <div className="absolute inset-0 animate-ping">
              <Award className="w-5 h-5 text-champagne opacity-50" />
            </div>
          </div>
          <span className="text-sm text-champagne font-medium tracking-wide">
            7+ Certified Funded Traders
          </span>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>

        {/* Logo */}
        <div className="animate-fade-up delay-100 opacity-0 mb-12">
          <Image
            src="/logo-hvc-white.png"
            alt="High Value Capital"
            width={320}
            height={110}
            className="mx-auto drop-shadow-2xl"
            priority
          />
        </div>

        {/* Headline avec typo Editorial */}
        <h1 className="animate-fade-up delay-200 opacity-0 font-display text-5xl md:text-7xl lg:text-8xl font-medium mb-8 leading-[1.1] tracking-tight">
          Tu galères à être{' '}
          <span className="italic">rentable</span>
          <br />
          <span className="text-gradient-shine">en trading ?</span>
        </h1>

        {/* Sous-titre */}
        <p className="animate-fade-up delay-300 opacity-0 text-xl md:text-2xl text-mist mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Découvre la méthode qui a permis à{' '}
          <span className="text-champagne font-medium">7+ membres</span> de devenir
          Funded Traders et générer{' '}
          <span className="text-champagne font-medium">20,000$+</span> de payouts.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-400 opacity-0 flex flex-col sm:flex-row gap-5 justify-center mb-16">
          <a href={URLS.premium} className="btn-primary text-lg group">
            <span className="flex items-center gap-2">
              Rejoindre la Formation
              <span className="text-gold-light">97€</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
          <a href={URLS.discord} className="btn-secondary text-lg group" target="_blank" rel="noopener noreferrer">
            <span className="flex items-center gap-2">
              Rejoindre le Discord
            </span>
          </a>
        </div>

        {/* Trust badges */}
        <div className="animate-fade-up delay-500 opacity-0 flex flex-wrap justify-center gap-8 text-mist text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-champagne/70" />
            <span>Garantie 7 jours</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-champagne/70" />
            <span>150+ membres actifs</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-champagne/70" />
            <span>Alpha Capital • APEX • BlueberryFunded</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-mist/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>

      {/* Gradient line separator */}
      <div className="absolute bottom-0 left-0 right-0 gradient-line" />
    </section>
  )
}

// Composant Stats
function Stats() {
  const { ref, revealed } = useScrollReveal()

  const stats = [
    { value: '7+', label: 'Funded Traders', icon: Award, suffix: '' },
    { value: '20k', label: 'Payouts Documentés', icon: DollarSign, suffix: '$+' },
    { value: '150', label: 'Membres Actifs', icon: Users, suffix: '+' },
  ]

  return (
    <section ref={ref} className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center p-8 rounded-2xl bg-glass border border-champagne/10 transition-all duration-700 ${
                revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <stat.icon className="w-10 h-10 text-champagne mx-auto mb-4 icon-gold" />
              <div className="font-display text-5xl md:text-6xl font-medium text-gradient-gold mb-3">
                {stat.value}
                <span className="text-champagne">{stat.suffix}</span>
              </div>
              <div className="text-mist uppercase tracking-wider text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Composant Problème
function Problem() {
  const { ref, revealed } = useScrollReveal()

  const painPoints = [
    "Tu regardes des vidéos YouTube depuis des mois, mais tu perds toujours de l'argent",
    "Tu as essayé 10 stratégies différentes, aucune ne marche vraiment",
    "Tu te sens seul devant tes graphiques, sans personne pour te guider",
    "Tu as cramé des comptes propfirm à cause du daily loss ou du revenge trading",
    "Tu comprends la théorie, mais en réel tu paniques et tu fais n'importe quoi",
  ]

  return (
    <section ref={ref} className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
            Tu te <span className="italic text-gradient-gold">reconnais</span> ?
          </h2>
          <p className="text-mist text-lg max-w-2xl mx-auto">
            Si tu ressens au moins une de ces frustrations, tu n'es pas seul.
          </p>
        </div>

        <div className="space-y-4">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className={`flex items-start gap-5 p-5 rounded-xl bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-all duration-700 ${
                revealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-pearl text-lg leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 gradient-line" />
    </section>
  )
}

// Composant Agitation
function Agitation() {
  const { ref, revealed } = useScrollReveal()

  return (
    <section ref={ref} className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className={`transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-12">
            Et si <span className="italic">rien</span> ne change...
          </h2>

          <div className="relative p-10 md:p-16 rounded-3xl bg-glass-gold border border-champagne/20 glow-gold">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-champagne/30 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-champagne/30 rounded-br-3xl" />

            <p className="text-2xl text-ivory mb-8 font-light">
              Chaque jour qui passe, tu perds du temps et de l'argent.
            </p>
            <p className="text-lg text-mist mb-10 max-w-2xl mx-auto">
              Pendant que tu tournes en rond avec des stratégies trouvées sur internet,
              d'autres traders passent leurs challenges et reçoivent leurs premiers payouts.
            </p>

            <div className="gradient-line mb-10 max-w-md mx-auto" />

            <p className="font-display text-3xl md:text-4xl text-champagne mb-6 italic">
              La différence entre eux et toi ?
            </p>
            <p className="text-xl text-ivory font-medium">
              Ils ont un mentor. Une méthode claire. Une communauté qui les pousse.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Composant Solution
function Solution() {
  const { ref, revealed } = useScrollReveal()

  const features = [
    {
      icon: BookOpen,
      title: 'Formation complète',
      description: 'Méthode ARD, zones de liquidité, manipulation, confluences - tout expliqué étape par étape.'
    },
    {
      icon: Users,
      title: 'Communauté active',
      description: 'Rejoins un groupe de traders sur Discord. Partage de trades quotidien, analyses en temps réel.'
    },
    {
      icon: Video,
      title: 'Sessions live',
      description: "Je t'explique mes trades en direct, mes erreurs, mes réussites. Tu apprends en me regardant trader."
    },
    {
      icon: MessageCircle,
      title: 'Suivi personnalisé',
      description: 'Tu peux me poser tes questions directement. Je review tes trades et te guide.'
    },
    {
      icon: FileText,
      title: 'Templates & outils',
      description: "Checklist pre-trade, journal de trading, templates de backtesting - tout ce qu'il te faut."
    },
    {
      icon: TrendingUp,
      title: 'Résultats prouvés',
      description: '7+ membres Certified Funded Traders. 20k$+ de payouts documentés.'
    },
  ]

  return (
    <section ref={ref} className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 text-champagne text-sm uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4" />
            La Solution
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
            High Value Capital
          </h2>
          <p className="text-mist text-lg max-w-3xl mx-auto leading-relaxed">
            Je m'appelle <span className="text-ivory font-medium">Jordy Banks</span>. Je trade depuis 6 ans.
            J'ai créé HVC parce que j'en avais marre de voir des traders galérer avec des formations qui ne marchent pas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`card p-8 group transition-all duration-700 ${
                revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <div className="p-3 rounded-xl bg-champagne/10 w-fit mb-6 group-hover:bg-champagne/20 transition-colors">
                <feature.icon className="w-7 h-7 text-champagne" />
              </div>
              <h3 className="font-display text-2xl font-medium mb-3 text-ivory">{feature.title}</h3>
              <p className="text-mist leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 gradient-line" />
    </section>
  )
}

// Composant Témoignages
function Testimonials() {
  const { ref, revealed } = useScrollReveal()

  const testimonials = [
    {
      name: 'Tauraa TEMAEVA',
      badge: 'Funded Trader',
      result: 'Alpha Capital - Oct 2025',
      text: "Certified Funded Trader chez Alpha Capital Group. Merci à la team et @Jordy Banks pour les concepts qui m'ont permis de passer le challenge.",
      highlight: true
    },
    {
      name: 'Flores Vista',
      badge: '10,000$ Payout',
      result: 'En 1 mois',
      text: "En 6 mois avec HVC, j'ai passé mes challenges 5k, 50k, 100k et accumulé 10,000$ de payout. Communauté au top.",
      highlight: true
    },
    {
      name: 'Tehei MT',
      badge: 'Funded',
      result: '6 mois de grind',
      text: 'We did it after 6 months of grind, thanks HVC beast! La persévérance et le suivi de la méthode paient toujours.',
      highlight: false
    },
    {
      name: 'Kehaulani Maruhi',
      badge: 'Admin/Funded',
      result: 'APEX Futures - Oct 2025',
      text: 'Funded en futures sur APEX. Maintenant il faut sécuriser des payouts. Les concepts de liquidité marchent aussi sur les futures!',
      highlight: true
    },
  ]

  return (
    <section ref={ref} className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 text-champagne text-sm uppercase tracking-widest mb-6">
            <Star className="w-4 h-4" />
            Témoignages
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mb-4">
            Ce qu'ils en <span className="italic">disent</span>
          </h2>
          <p className="text-mist text-lg">
            Résultats réels de traders comme toi
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 transition-all duration-700 ${
                testimonial.highlight
                  ? 'card-highlight glow-gold'
                  : 'card'
              } ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="font-display text-xl font-medium text-ivory">{testimonial.name}</h4>
                  <p className="text-champagne text-sm mt-1">{testimonial.result}</p>
                </div>
                <span className="bg-gradient-gold text-void text-xs font-bold px-4 py-1.5 rounded-full">
                  {testimonial.badge}
                </span>
              </div>
              <p className="text-pearl leading-relaxed text-lg italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
          <a
            href={URLS.testimonials}
            className="inline-flex items-center gap-2 text-champagne hover:text-gold-light transition-colors group"
          >
            Voir tous les témoignages
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}

// Composant Pricing
function Pricing() {
  const { ref, revealed } = useScrollReveal()

  return (
    <section ref={ref} className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 text-champagne text-sm uppercase tracking-widest mb-6">
            <Target className="w-4 h-4" />
            Tarifs
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium">
            Choisis ton <span className="italic">accès</span>
          </h2>
        </div>

        <div className="max-w-lg mx-auto">
          <div className={`relative card-highlight p-10 glow-gold-intense transition-all duration-700 rounded-2xl ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            <h3 className="font-display text-3xl font-medium mb-2 text-ivory">Formation HVC</h3>
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-5xl text-champagne">97€</span>
              <span className="text-mist">paiement unique</span>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                'Formation complète avancée (20+ heures)',
                'Communauté Discord privée',
                'Sessions live hebdomadaires',
                'Analyses de trades personnalisées',
                'Signaux IA en temps réel',
                'Templates et outils exclusifs',
                'Accès à vie + mises à jour',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <CheckCircle className="w-5 h-5 text-champagne flex-shrink-0 mt-0.5" />
                  <span className="text-pearl">{item}</span>
                </li>
              ))}
            </ul>

            <a href={URLS.premium} className="btn-primary w-full text-center block text-lg">
              <span className="flex items-center justify-center gap-2">
                Rejoindre HVC
                <ArrowRight className="w-5 h-5" />
              </span>
            </a>

            <p className="text-center text-sm text-mist mt-5">
              95% de nos Funded Traders ont choisi cette formation
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 gradient-line" />
    </section>
  )
}

// Composant Garantie
function Guarantee() {
  const { ref, revealed } = useScrollReveal()

  return (
    <section ref={ref} className="py-20 relative">
      <div className={`max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="p-3 rounded-2xl bg-champagne/10 w-fit mx-auto mb-8">
          <Shield className="w-12 h-12 text-champagne icon-gold" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-medium mb-6 text-ivory">
          Essaie sans risque
        </h2>
        <p className="text-xl text-pearl mb-4">
          Tu peux tester la formation Premium pendant{' '}
          <span className="text-champagne font-medium">7 jours</span>.
        </p>
        <p className="text-mist text-lg">
          Si tu n'es pas satisfait, tu me contactes et je te rembourse.
          <br />Pas de questions. Pas de justification.
        </p>
      </div>
    </section>
  )
}

// Composant FAQ
function FAQ() {
  const { ref, revealed } = useScrollReveal()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "C'est quoi exactement la méthode ARD ?",
      answer: "C'est la méthode ARD (Accumulation, Recharge, Distribution) - une approche qui permet de comprendre où les institutions placent leurs ordres. Au lieu de suivre des indicateurs en retard, tu apprends à lire le marché comme les pros."
    },
    {
      question: "Combien de temps avant de voir des résultats ?",
      answer: "Ça dépend de ton engagement. Certains membres passent leurs premiers challenges en 3-6 mois. D'autres prennent plus de temps. L'important c'est de progresser chaque jour."
    },
    {
      question: "J'ai déjà essayé d'autres formations, pourquoi celle-ci serait différente ?",
      answer: "Parce qu'on a des résultats concrets : 7+ Funded Traders chez Alpha Capital, APEX et BlueberryFunded. 20k$+ de payouts documentés. Et surtout, une communauté active qui partage ses trades tous les jours."
    },
    {
      question: "Est-ce que ça marche pour les débutants complets ?",
      answer: "Oui. La formation part de zéro. Mais tu dois être prêt à apprendre et à pratiquer sérieusement."
    },
    {
      question: "Je travaille à côté, j'ai pas beaucoup de temps...",
      answer: "Beaucoup de nos membres ont un job. Tu peux trader la session London le soir ou te concentrer sur les setups daily/weekly. La méthode s'adapte à ton emploi du temps."
    },
  ]

  return (
    <section ref={ref} className="py-24 relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-display text-4xl md:text-5xl font-medium">
            Questions <span className="italic">fréquentes</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`card overflow-hidden transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-champagne/5 transition-colors"
              >
                <span className="font-medium text-ivory pr-4">{faq.question}</span>
                <div className={`p-2 rounded-lg bg-champagne/10 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-5 h-5 text-champagne" />
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 pb-6 text-mist leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 gradient-line" />
    </section>
  )
}

// Composant CTA Final
function FinalCTA() {
  const { ref, revealed } = useScrollReveal()

  return (
    <section ref={ref} className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className={`transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
            Arrête de <span className="italic">galérer</span> seul.
          </h2>
          <p className="font-display text-2xl md:text-3xl text-champagne mb-10 italic">
            Rejoins une communauté qui obtient des résultats.
          </p>

          <p className="text-mist text-lg mb-12 max-w-2xl mx-auto">
            Tu as deux choix : continuer à chercher des stratégies sur YouTube et perdre encore
            des mois à tourner en rond. Ou rejoindre High Value Capital et avoir une communauté
            qui te soutient jusqu'à ton premier payout.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a href={URLS.premium} className="btn-primary text-lg group">
              <span className="flex items-center gap-2">
                Rejoindre HVC - 97€
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
            <a href={URLS.discord} className="btn-secondary text-lg" target="_blank" rel="noopener noreferrer">
              <span>Voir le Discord</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// Composant Footer
function Footer() {
  return (
    <footer className="py-12 border-t border-champagne/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Image
              src="/icon-hvc-white.png"
              alt="High Value Capital"
              width={50}
              height={50}
              className="mx-auto md:mx-0 mb-3 opacity-80"
            />
            <p className="text-mist text-sm">Formation Trading Forex</p>
          </div>

          <p className="text-smoke text-xs text-center max-w-md leading-relaxed">
            Le trading comporte des risques. Les résultats passés ne garantissent pas les résultats futurs.
            Investis uniquement ce que tu peux te permettre de perdre.
          </p>

          <p className="text-smoke text-sm">
            © 2026 High Value Capital
          </p>
        </div>
      </div>
    </footer>
  )
}

// Page principale
export default function Home() {
  return (
    <main className="relative">
      <AnimatedBackground />
      <Hero />
      <Stats />
      <Problem />
      <Agitation />
      <Solution />
      <Testimonials />
      <Pricing />
      <Guarantee />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
