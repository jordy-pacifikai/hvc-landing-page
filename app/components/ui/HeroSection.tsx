'use client'

import { useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { Shield, Users, Star, ChevronDown, ArrowRight } from 'lucide-react'
import RotatingText from '../effects/RotatingText'
import MagneticButton from '../effects/MagneticButton'
import { trackEvent, identifyLead } from '../../lib/posthog'
import { trackCheckoutInitiated } from '../../lib/analytics'

const URLS = {
  premium: '/checkout',
}

/* ============ DOLLAR RAIN ============ */
function DollarRain({ count = 25 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 137.508) % 100}%`, // golden angle spread
      delay: `${(i * 0.7) % 12}s`,
      duration: `${8 + (i % 7) * 2}s`,
      size: 10 + (i % 4) * 3,
      opacity: 0.04 + (i % 5) * 0.015,
    }))
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 text-accent font-mono select-none"
          style={{
            left: p.left,
            fontSize: p.size,
            opacity: p.opacity,
            animation: `dollar-fall ${p.duration} linear ${p.delay} infinite`,
          }}
        >
          $
        </span>
      ))}
    </div>
  )
}

export default function HeroSection() {
  const badgeRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
  const blobContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(badgeRef.current, { y: 20, opacity: 0, duration: 0.6, delay: 0.1 })
      gsap.from(logoRef.current, { y: 30, opacity: 0, duration: 0.7, delay: 0.3 })
      gsap.from(subtitleRef.current, { y: 30, opacity: 0, duration: 0.8, delay: 1.2 })
      gsap.from(ctaRef.current, { y: 30, opacity: 0, duration: 0.8, delay: 1.5 })
      gsap.from(trustRef.current, { y: 20, opacity: 0, duration: 0.6, delay: 1.8 })
    })
    return () => ctx.revert()
  }, [])

  // Mouse parallax for blobs
  useEffect(() => {
    const mouse = { x: 0.5, y: 0.5 }
    const current = { x: 0.5, y: 0.5 }
    let raf: number

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = e.clientY / window.innerHeight
    }

    const tick = () => {
      current.x += (mouse.x - current.x) * 0.04
      current.y += (mouse.y - current.y) * 0.04
      if (blobContainerRef.current) {
        const dx = (current.x - 0.5) * 30
        const dy = (current.y - 0.5) * 20
        blobContainerRef.current.style.transform = `translate(${dx}px, ${dy}px)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section className="relative min-h-[85svh] flex items-center justify-center overflow-hidden hero-mesh">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Liquid blobs with parallax */}
      <div ref={blobContainerRef} className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[5%] left-[10%] w-[350px] h-[350px] rounded-full blur-[80px] opacity-[0.08]" style={{
          background: 'radial-gradient(circle, #2563EB 0%, #6366f1 40%, transparent 70%)',
          animation: 'blob-float 14s ease-in-out infinite',
        }} />
        <div className="absolute top-[30%] right-[5%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.06]" style={{
          background: 'radial-gradient(circle, #60A5FA 0%, #2563EB 40%, transparent 70%)',
          animation: 'blob-float 18s ease-in-out 2s infinite reverse',
        }} />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05]" style={{
          background: 'radial-gradient(circle, #6366f1 0%, #22d3ee 40%, transparent 70%)',
          animation: 'blob-float 22s ease-in-out 4s infinite',
        }} />
      </div>

      {/* Dollar sign rain */}
      <DollarRain count={25} />

      {/* Center radial glow */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-accent/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
        {/* Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2.5 glass px-4 py-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-green-500" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
          <span className="text-xs sm:text-sm text-ivory-muted font-medium tracking-wide uppercase">
            15+ Certified Funded Traders
          </span>
        </div>

        {/* Logo */}
        <div ref={logoRef} className="mb-6 sm:mb-8">
          <Image
            src="/logo-hvc-gradient.png"
            alt="High Value Capital"
            width={280}
            height={96}
            className="mx-auto w-36 sm:w-48 md:w-64 h-auto"
            priority
          />
        </div>

        {/* Headline — always 2 lines max */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-display-xl font-normal mb-6 leading-tight">
          <span className="block">Tu galères à être</span>
          <span className="block">
            <RotatingText
              prefix=""
              words={["rentable", "funded", "discipliné", "profitable"]}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-display-xl font-normal"
              interval={3000}
            />
            {' '}<span className="text-accent">en trading ?</span>
          </span>
        </h1>

        {/* Subline */}
        <p ref={subtitleRef} className="text-base sm:text-lg md:text-xl text-ivory-muted max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          La méthode qui a permis à <span className="text-ivory font-medium">15+ membres</span> de
          devenir Funded Traders et générer <span className="text-ivory font-medium">85,000$+</span> de payouts.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <MagneticButton
            href={URLS.premium}
            variant="primary"
            className="text-base"
            onClick={() => { trackEvent('cta_clicked', { location: 'hero' }); trackCheckoutInitiated() }}
          >
            Rejoindre la Formation
            <span className="text-blue-200/70 font-normal">— dès 24,50€/mois</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>

        {/* Trust */}
        <div ref={trustRef} className="flex flex-wrap justify-center gap-4 sm:gap-10 text-ivory-dim text-xs sm:text-sm">
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory-ghost z-10">
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>

      <div className="absolute bottom-0 inset-x-0 accent-line z-10" />
    </section>
  )
}
