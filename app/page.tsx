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
  Award,
  BookOpen,
  MessageCircle,
  Video,
  Shield,
  Star,
  ArrowRight,
  Mail,
  BarChart3,
} from 'lucide-react'
import ChatWidget from './components/ChatWidget'
import { trackEvent, identifyLead } from './lib/posthog'
import { trackNewsletterSignup, trackCheckoutInitiated } from './lib/analytics'
import { captureUTM, getStoredUTM } from './lib/utm'

const URLS = {
  discord: 'https://discord.gg/nwc8kbxSVt',
  premium: '/checkout',
  testimonials: '/temoignages',
}

// ─── Scroll Reveal Hook ───────────────────────────────
function useReveal(sectionName?: string) {
  const [revealed, setRevealed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          if (sectionName) trackEvent('section_viewed', { section: sectionName })
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [sectionName])

  return { ref, revealed }
}

// ─── Counter Hook ─────────────────────────────────────
function useCountUp(end: number, duration: number, active: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(ease * end))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [end, duration, active])
  return val
}

// ─── HERO ─────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setLoaded(true) }, [])

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-accent/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 py-24 text-center">
        {/* Badge */}
        <div className={`reveal-up ${loaded ? 'revealed' : ''} stagger-1 inline-flex items-center gap-2.5 border border-black-border rounded-full px-4 py-2 mb-12`}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs sm:text-sm text-ivory-muted font-medium tracking-wide uppercase">
            15+ Certified Funded Traders
          </span>
        </div>

        {/* Logo */}
        <div className={`reveal-up ${loaded ? 'revealed' : ''} stagger-2 mb-10`}>
          <Image
            src="/logo-hvc-gradient.png"
            alt="High Value Capital"
            width={280}
            height={96}
            className="mx-auto w-44 sm:w-56 md:w-72 h-auto"
            priority
          />
        </div>

        {/* Headline */}
        <h1 className={`reveal-up ${loaded ? 'revealed' : ''} stagger-3 font-display text-display-xl font-normal mb-8`}>
          Tu galères à être <em>rentable</em>
          <br />
          <span className="text-accent">en trading ?</span>
        </h1>

        {/* Subline */}
        <p className={`reveal-up ${loaded ? 'revealed' : ''} stagger-4 text-lg md:text-xl text-ivory-muted max-w-2xl mx-auto mb-14 leading-relaxed font-light`}>
          La méthode qui a permis à <span className="text-ivory font-medium">15+ membres</span> de
          devenir Funded Traders et générer <span className="text-ivory font-medium">85,000$+</span> de payouts.
        </p>

        {/* CTA */}
        <div className={`reveal-up ${loaded ? 'revealed' : ''} stagger-5 flex flex-col sm:flex-row gap-4 justify-center mb-16`}>
          <a
            href={URLS.premium}
            className="btn-primary text-base group"
            onClick={() => { trackEvent('cta_clicked', { location: 'hero' }); trackCheckoutInitiated() }}
          >
            Rejoindre la Formation
            <span className="text-blue-200/70 font-normal">— dès 24,50€/mois</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Trust */}
        <div className={`reveal-up ${loaded ? 'revealed' : ''} stagger-6 flex flex-wrap justify-center gap-6 sm:gap-10 text-ivory-dim text-sm`}>
          {[
            { icon: Shield, text: 'Formation complete' },
            { icon: Users, text: '150+ membres actifs' },
            { icon: Star, text: 'Partenaires officiels' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <item.icon className="w-3.5 h-3.5 text-accent/70" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory-ghost">
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}

// ─── STATS ────────────────────────────────────────────
function Stats() {
  const { ref, revealed } = useReveal('stats')
  const funded = useCountUp(15, 1200, revealed)
  const payouts = useCountUp(85, 1400, revealed)
  const members = useCountUp(150, 1600, revealed)

  const stats = [
    { val: funded, suffix: '+', label: 'Funded Traders', icon: Award },
    { val: payouts, suffix: 'k$+', label: 'Payouts documentés', icon: DollarSign },
    { val: members, suffix: '+', label: 'Membres actifs', icon: Users },
  ]

  return (
    <section ref={ref} className="py-section relative">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`reveal-up ${revealed ? 'revealed' : ''} text-center py-10 px-6 rounded-xl border border-black-border bg-black-rich/50`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <s.icon className="w-8 h-8 text-accent mx-auto mb-5 opacity-80" />
              <div className="font-display text-display-md text-ivory tabular-nums">
                {s.val}<span className="text-accent">{s.suffix}</span>
              </div>
              <div className="text-ivory-dim text-sm uppercase tracking-wider mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PROBLEM ──────────────────────────────────────────
function Problem() {
  const { ref, revealed } = useReveal('problem')

  const pains = [
    "Tu regardes des vidéos YouTube depuis des mois, mais tu perds toujours de l'argent",
    "Tu as essayé 10 stratégies différentes, aucune ne marche vraiment",
    "Tu te sens seul devant tes graphiques, sans personne pour te guider",
    "Tu as cramé des comptes propfirm à cause du daily loss ou du revenge trading",
    "Tu comprends la théorie, mais en réel tu paniques et tu fais n'importe quoi",
  ]

  return (
    <section ref={ref} className="py-section relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className={`reveal-up ${revealed ? 'revealed' : ''} text-center mb-10 sm:mb-14`}>
          <h2 className="font-display text-display-lg mb-4">
            Tu te <em>reconnais</em> ?
          </h2>
          <p className="text-ivory-muted text-lg">
            Si tu ressens au moins une de ces frustrations, tu n'es pas seul.
          </p>
        </div>

        <div className="space-y-3">
          {pains.map((p, i) => (
            <div
              key={i}
              className={`reveal-up ${revealed ? 'revealed' : ''} flex items-start gap-4 p-4 sm:p-5 rounded-lg border border-red-500/10 bg-red-500/[0.03] hover:bg-red-500/[0.06] transition-colors`}
              style={{ transitionDelay: `${0.1 + i * 0.06}s` }}
            >
              <XCircle className="w-5 h-5 text-red-400/80 flex-shrink-0 mt-0.5" />
              <p className="text-ivory-muted text-base leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}

// ─── AGITATION ────────────────────────────────────────
function Agitation() {
  const { ref, revealed } = useReveal('agitation')

  return (
    <section ref={ref} className="py-section relative">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <div className={`reveal-up ${revealed ? 'revealed' : ''}`}>
          <h2 className="font-display text-display-lg mb-12">
            Et si <em>rien</em> ne change...
          </h2>

          <div className="relative p-8 sm:p-12 md:p-16 rounded-2xl border border-black-border bg-black-rich">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-accent/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-accent/30 rounded-br-2xl" />

            <p className="text-xl sm:text-2xl text-ivory mb-8 font-light leading-relaxed">
              Chaque jour qui passe, tu perds du temps et de l'argent.
            </p>
            <p className="text-ivory-muted text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Pendant que tu tournes en rond avec des stratégies trouvées sur internet,
              d'autres traders passent leurs challenges et reçoivent leurs premiers payouts.
            </p>

            <div className="w-16 h-px bg-accent/30 mx-auto mb-10" />

            <p className="font-display text-display-md text-accent mb-4">
              <em>La différence entre eux et toi ?</em>
            </p>
            <p className="text-lg text-ivory font-medium">
              Ils ont un mentor. Une méthode claire. Une communauté qui les pousse.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SOLUTION ─────────────────────────────────────────
function Solution() {
  const { ref, revealed } = useReveal('solution')

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
      desc: 'Checklist pre-trade, journal de trading, templates de backtesting — tout ce qu\'il te faut.',
    },
    {
      icon: TrendingUp,
      title: 'Résultats prouvés',
      desc: '15+ membres Certified Funded Traders. 85k$+ de payouts documentés.',
    },
  ]

  return (
    <section ref={ref} className="py-section relative">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className={`reveal-up ${revealed ? 'revealed' : ''} text-center mb-10 sm:mb-16`}>
          <p className="text-accent text-sm uppercase tracking-widest mb-4 font-medium">La Solution</p>
          <h2 className="font-display text-display-lg mb-6">
            High Value Capital
          </h2>
          <p className="text-ivory-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Une méthode structurée, une communauté active, et des résultats documentés.
            Tout ce qu'il te faut pour passer tes challenges et décrocher tes premiers payouts.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className={`reveal-up ${revealed ? 'revealed' : ''} card p-6 sm:p-8 group`}
              style={{ transitionDelay: `${0.1 + i * 0.06}s` }}
            >
              <div className="p-2.5 rounded-lg bg-accent-muted w-fit mb-5 group-hover:bg-accent/20 transition-colors">
                <f.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-xl font-normal mb-2 text-ivory">{f.title}</h3>
              <p className="text-ivory-dim text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}

// ─── PLATFORM PREVIEW ────────────────────────────────
function PlatformPreview() {
  const { ref, revealed } = useReveal('platform-preview')

  const channels = [
    { name: 'annonces', icon: '📢', unread: false },
    { name: 'signaux-trading', icon: '📊', unread: true },
    { name: 'analyses-live', icon: '🔴', unread: true },
    { name: 'résultats', icon: '🏆', unread: false },
    { name: 'propfirm', icon: '💰', unread: false },
    { name: 'discussion', icon: '💬', unread: true },
  ]

  const messages = [
    {
      author: 'Jordy Banks',
      role: 'Owner',
      time: '14:32',
      text: 'Setup EURUSD pris ce matin — zone de liquidité H4 tapée + recharge M15. TP touché en session London. +2.1R',
      roleColor: 'bg-red-500/20 text-red-400',
    },
    {
      author: 'Tauraa T.',
      role: 'Premium',
      time: '14:45',
      text: 'Funded chez Alpha Capital ! 3ème challenge réussi grâce à la méthode ARD 🔥',
      roleColor: 'bg-amber-500/20 text-amber-400',
    },
    {
      author: 'Flores V.',
      role: 'Premium',
      time: '15:02',
      text: 'Le journal de trading a changé mon approche. Je vois enfin mes patterns de pertes.',
      roleColor: 'bg-amber-500/20 text-amber-400',
    },
  ]

  return (
    <section ref={ref} className="py-section relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className={`reveal-up ${revealed ? 'revealed' : ''} text-center mb-10 sm:mb-14`}>
          <p className="text-accent text-sm uppercase tracking-widest mb-4 font-medium">La Plateforme</p>
          <h2 className="font-display text-display-lg mb-6">
            Tout est là-dedans
          </h2>
          <p className="text-ivory-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Formation, signaux, analyses live, communauté — une seule plateforme pour tout.
          </p>
        </div>

        {/* Mockup */}
        <div className={`reveal-up ${revealed ? 'revealed' : ''} stagger-3`}>
          <div className="relative mx-auto rounded-xl border border-white/[0.06] bg-[#0a0a0f] shadow-2xl shadow-black/50 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#0f0f15] border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-white/[0.04] text-[11px] text-white/30 font-mono">
                  community.highvaluecapital.club
                </div>
              </div>
            </div>

            {/* App layout */}
            <div className="flex min-h-[420px] sm:min-h-[480px]">
              {/* Sidebar */}
              <div className="hidden sm:flex flex-col w-56 bg-[#0c0c12] border-r border-white/[0.06] py-4">
                {/* Logo */}
                <div className="px-4 mb-5 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
                    <span className="text-accent text-xs font-bold">H</span>
                  </div>
                  <span className="text-ivory text-sm font-medium">HVC Community</span>
                </div>

                {/* Channels */}
                <div className="px-3 mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-white/20 font-medium px-1 mb-2">Channels</p>
                </div>
                {channels.map((ch, i) => (
                  <div
                    key={i}
                    className={`mx-2 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm ${
                      i === 1 ? 'bg-white/[0.06] text-ivory' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    <span className="text-xs">{ch.icon}</span>
                    <span className="truncate text-[13px]">{ch.name}</span>
                    {ch.unread && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    )}
                  </div>
                ))}

                {/* Bottom: user */}
                <div className="mt-auto px-4 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent/30" />
                    <span className="text-xs text-white/40 truncate">Mon compte</span>
                  </div>
                </div>
              </div>

              {/* Main chat area */}
              <div className="flex-1 flex flex-col">
                {/* Channel header */}
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <span className="text-sm">📊</span>
                  <span className="text-ivory text-sm font-medium">signaux-trading</span>
                  <span className="text-white/20 text-xs ml-2 hidden sm:inline">Analyses et setups partagés par la team</span>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 sm:p-5 space-y-5 overflow-hidden">
                  {messages.map((msg, i) => (
                    <div key={i} className="flex gap-3" style={{ opacity: revealed ? 1 : 0, transition: `opacity 0.5s ${0.4 + i * 0.15}s` }}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 flex-shrink-0 flex items-center justify-center">
                        <span className="text-[10px] text-accent font-bold">{msg.author[0]}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-ivory text-sm font-medium">{msg.author}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${msg.roleColor}`}>{msg.role}</span>
                          <span className="text-white/15 text-[11px]">{msg.time}</span>
                        </div>
                        <p className="text-white/50 text-[13px] leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input bar */}
                <div className="px-4 sm:px-5 py-3 border-t border-white/[0.06]">
                  <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-4 py-2.5 text-white/20 text-sm">
                    Écrire un message...
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle glow behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/[0.03] rounded-full blur-[120px] pointer-events-none -z-10" />
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────
function Testimonials() {
  const { ref, revealed } = useReveal('testimonials')

  const items = [
    {
      name: 'Tauraa TEMAEVA',
      badge: 'Funded Trader',
      result: 'Alpha Capital — Oct 2025',
      text: "Certified Funded Trader chez Alpha Capital Group. Merci à la team et @Jordy Banks pour les concepts qui m'ont permis de passer le challenge.",
      highlight: true,
    },
    {
      name: 'Flores Vista',
      badge: '10,000$ Payout',
      result: 'En 1 mois',
      text: "En 6 mois avec HVC, j'ai passé mes challenges 5k, 50k, 100k et accumulé 10,000$ de payout. Communauté au top.",
      highlight: true,
    },
    {
      name: 'Tehei MT',
      badge: 'Funded',
      result: '6 mois de grind',
      text: 'We did it after 6 months of grind, thanks HVC beast! La persévérance et le suivi de la méthode paient toujours.',
      highlight: false,
    },
    {
      name: 'Kehaulani Maruhi',
      badge: 'Admin/Funded',
      result: 'APEX Futures — Oct 2025',
      text: 'Funded en futures sur APEX. Maintenant il faut sécuriser des payouts. Les concepts de liquidité marchent aussi sur les futures!',
      highlight: true,
    },
  ]

  return (
    <section ref={ref} className="py-section relative">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className={`reveal-up ${revealed ? 'revealed' : ''} text-center mb-10 sm:mb-14`}>
          <p className="text-accent text-sm uppercase tracking-widest mb-4 font-medium">Témoignages</p>
          <h2 className="font-display text-display-lg mb-4">
            Ce qu'ils en <em>disent</em>
          </h2>
          <p className="text-ivory-muted text-lg">Résultats réels de traders comme toi</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((t, i) => (
            <div
              key={i}
              className={`reveal-up ${revealed ? 'revealed' : ''} ${
                t.highlight ? 'card-accent' : 'card'
              } p-6 sm:p-8`}
              style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="min-w-0">
                  <h4 className="font-display text-lg text-ivory">{t.name}</h4>
                  <p className="text-accent text-sm mt-0.5">{t.result}</p>
                </div>
                <span className="bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap flex-shrink-0">
                  {t.badge}
                </span>
              </div>
              <p className="text-ivory-muted leading-relaxed italic">"{t.text}"</p>
            </div>
          ))}
        </div>

        <div className={`reveal-up ${revealed ? 'revealed' : ''} text-center mt-10`} style={{ transitionDelay: '0.4s' }}>
          <a href={URLS.testimonials} className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors text-sm font-medium group">
            Voir tous les témoignages
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── PARTNERS ────────────────────────────────────────
function Partners() {
  const { ref, revealed } = useReveal('partners')

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
      promo: 'Code HVC15 — 15% off',
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

  return (
    <section ref={ref} className="py-16 sm:py-20 relative">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className={`reveal-up ${revealed ? 'revealed' : ''} text-center mb-10`}>
          <p className="text-accent text-sm uppercase tracking-widest mb-3 font-medium">Partenaires officiels</p>
          <p className="text-ivory-muted text-base">
            Les outils que nous utilisons et recommandons — avec des codes promo exclusifs.
          </p>
        </div>

        <div className={`reveal-up ${revealed ? 'revealed' : ''} flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16`} style={{ transitionDelay: '0.15s' }}>
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
                className="w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{ height: p.height, maxWidth: p.width }}
              />
              <span className="text-ivory-dim text-xs tracking-wide group-hover:text-accent transition-colors duration-300">
                {p.promo}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}

// ─── PRICING ──────────────────────────────────────────
function Pricing() {
  const { ref, revealed } = useReveal('pricing')

  const included = [
    'Formation complète avancée (20+ heures)',
    'Communauté Discord privée',
    'Analyses de trades personnalisées',
  ]

  return (
    <section ref={ref} className="py-section relative">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className={`reveal-up ${revealed ? 'revealed' : ''} text-center mb-10 sm:mb-14`}>
          <p className="text-accent text-sm uppercase tracking-widest mb-4 font-medium">Tarifs</p>
          <h2 className="font-display text-display-lg">
            Choisis ton <em>accès</em>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
          {/* Monthly */}
          <div className={`reveal-up ${revealed ? 'revealed' : ''} card p-6 sm:p-8`} style={{ transitionDelay: '0.1s' }}>
            <h3 className="font-display text-xl mb-2 text-ivory">Mensuel</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-4xl text-ivory">49€</span>
              <span className="text-ivory-dim text-sm">/mois</span>
            </div>
            <p className="text-ivory-ghost text-sm mb-8">Sans engagement, résiliable à tout moment</p>

            <ul className="space-y-3 mb-8">
              {included.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-ivory-muted text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={URLS.premium}
              className="btn-secondary w-full"
              onClick={() => { trackEvent('cta_clicked', { location: 'pricing_monthly' }); trackCheckoutInitiated() }}
            >
              Choisir mensuel
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Annual — featured */}
          <div className={`reveal-up ${revealed ? 'revealed' : ''} card-accent p-6 sm:p-8 relative`} style={{ transitionDelay: '0.18s' }}>
            <span className="absolute -top-3 right-4 bg-accent text-white text-[11px] font-bold px-3 py-1 rounded-md tracking-wide uppercase">
              -50%
            </span>
            <h3 className="font-display text-xl mb-2 text-ivory">Annuel</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-4xl text-accent">24,50€</span>
              <span className="text-ivory-dim text-sm">/mois</span>
            </div>
            <p className="text-ivory-ghost text-sm mb-8">
              294€ facturé une fois <span className="line-through">588€</span>
            </p>

            <ul className="space-y-3 mb-8">
              {[...included, "12 mois d'accès garanti"].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-ivory-muted text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={URLS.premium}
              className="btn-primary w-full"
              onClick={() => { trackEvent('cta_clicked', { location: 'pricing_yearly' }); trackCheckoutInitiated() }}
            >
              Choisir annuel — Économise 294€
              <ArrowRight className="w-4 h-4" />
            </a>

            <p className="text-center text-xs text-ivory-ghost mt-4">
              95% de nos Funded Traders ont choisi cette formation
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}

// ─── GUARANTEE ────────────────────────────────────────
function Guarantee() {
  const { ref, revealed } = useReveal('guarantee')

  return (
    <section ref={ref} className="py-section relative">
      <div className={`reveal-up ${revealed ? 'revealed' : ''} max-w-2xl mx-auto px-5 sm:px-8 text-center`}>
        <Shield className="w-12 h-12 text-accent mx-auto mb-6 opacity-80" />
        <h2 className="font-display text-display-md mb-6 text-ivory">
          Pret a passer au niveau superieur ?
        </h2>
        <p className="text-xl text-ivory-muted mb-3 leading-relaxed">
          Rejoins <span className="text-accent font-medium">150+ membres</span> qui ont transforme leur trading.
        </p>
        <p className="text-ivory-dim text-base leading-relaxed">
          49EUR/mois, sans engagement, resiliable a tout moment.
        </p>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────
function FAQ() {
  const { ref, revealed } = useReveal('faq')
  const [open, setOpen] = useState<number | null>(null)

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

  return (
    <section ref={ref} className="py-section relative">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className={`reveal-up ${revealed ? 'revealed' : ''} text-center mb-10 sm:mb-14`}>
          <h2 className="font-display text-display-lg">
            Questions <em>fréquentes</em>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`reveal-up ${revealed ? 'revealed' : ''} card overflow-hidden`}
              style={{ transitionDelay: `${0.05 + i * 0.04}s` }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-black-hover/50 transition-colors"
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-ivory text-sm sm:text-base font-medium pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-ivory-dim flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <div id={`faq-answer-${i}`} role="region" className={`overflow-hidden transition-all duration-300 ease-out ${open === i ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-5 pb-5 text-ivory-dim text-sm leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}

// ─── FINAL CTA ────────────────────────────────────────
function FinalCTA() {
  const { ref, revealed } = useReveal('final_cta')

  return (
    <section ref={ref} className="py-section relative">
      <div className={`reveal-up ${revealed ? 'revealed' : ''} max-w-3xl mx-auto px-5 sm:px-8 text-center`}>
        <h2 className="font-display text-display-lg mb-4">
          Arrête de <em>galérer</em> seul.
        </h2>
        <p className="font-display text-display-md text-accent mb-10">
          <em>Rejoins une communauté qui obtient des résultats.</em>
        </p>
        <p className="text-ivory-muted text-base sm:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Continuer à chercher sur YouTube, ou rejoindre High Value Capital
          et avoir un mentor jusqu'à ton premier payout.
        </p>

        <a
          href={URLS.premium}
          className="btn-primary text-base group"
          onClick={() => { trackEvent('cta_clicked', { location: 'footer' }); trackCheckoutInitiated() }}
        >
          Rejoindre HVC — dès 24,50€/mois
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  )
}

// ─── NEWSLETTER ───────────────────────────────────────
function Newsletter() {
  const { ref, revealed } = useReveal('newsletter')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const utm = getStoredUTM()
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, ...utm }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        trackEvent('newsletter_signup', { source: 'landing_page' })
        trackNewsletterSignup()
        identifyLead(email, { name, source: 'newsletter' })
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Une erreur est survenue.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Une erreur est survenue.')
    }
  }

  return (
    <section ref={ref} className="py-section relative">
      <div className="max-w-xl mx-auto px-5 sm:px-8">
        <div className={`reveal-up ${revealed ? 'revealed' : ''} rounded-2xl border border-black-border bg-black-rich p-8 sm:p-12`}>
          <div className="text-center mb-8">
            <Mail className="w-8 h-8 text-accent mx-auto mb-4 opacity-80" />
            <h2 className="font-display text-display-md mb-3 text-ivory">
              Progresse chaque semaine
            </h2>
            <p className="text-ivory-dim text-sm leading-relaxed">
              Rejoins 1000+ traders et reçois nos meilleurs conseils chaque semaine.
            </p>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
              <p className="text-ivory text-lg font-medium">Inscription confirmée !</p>
              <p className="text-ivory-dim text-sm">Check tes emails.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ton prénom"
                  required
                  disabled={status === 'loading'}
                  aria-label="Prénom"
                  className="flex-1 min-w-0 bg-black-card border border-black-border rounded-lg px-4 py-3 text-ivory text-sm placeholder:text-ivory-ghost focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Ton email"
                  required
                  disabled={status === 'loading'}
                  aria-label="Email"
                  className="flex-1 min-w-0 bg-black-card border border-black-border rounded-lg px-4 py-3 text-ivory text-sm placeholder:text-ivory-ghost focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Inscription...
                  </span>
                ) : (
                  <>
                    Recevoir les conseils gratuits
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-ivory-ghost">
                Zéro spam. Désabonnement en 1 clic.
              </p>
            </form>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line" />
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-10 border-t border-black-border">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Image
              src="/icon-hvc-gradient.png"
              alt="High Value Capital"
              width={40}
              height={40}
              className="mx-auto md:mx-0 mb-2 opacity-80"
            />
            <p className="text-ivory-dim text-sm">Formation Trading Forex</p>
          </div>

          <p className="text-ivory-ghost text-xs text-center max-w-md leading-relaxed">
            Le trading comporte des risques. Les résultats passés ne garantissent pas les résultats futurs.
            Investis uniquement ce que tu peux te permettre de perdre.
          </p>

          <p className="text-ivory-ghost text-sm">
            © 2026 High Value Capital
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── PAGE ─────────────────────────────────────────────
export default function Home() {
  useEffect(() => { captureUTM() }, [])

  return (
    <main className="relative overflow-x-hidden w-full">
      <div className="noise-overlay" />
      <ChatWidget />
      <Hero />
      <Stats />
      <Problem />
      <Agitation />
      <Solution />
      <PlatformPreview />
      <Testimonials />
      <Partners />
      <Pricing />
      <Guarantee />
      <FAQ />
      <FinalCTA />
      <Newsletter />
      <Footer />
    </main>
  )
}
