'use client'

import { useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { Shield, Users, Star, ArrowRight } from 'lucide-react'
import RotatingText from '../effects/RotatingText'
import MagneticButton from '../effects/MagneticButton'
import CommunityPreview from './CommunityPreview'
import { trackEvent, identifyLead } from '../../lib/posthog'
import { trackCheckoutInitiated } from '../../lib/analytics'

const URLS = {
  premium: '/checkout',
}

function DollarRain({ count = 25 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 137.508) % 100}%`,
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
    <section className="relative flex flex-col overflow-visible hero-mesh pb-12 sm:pb-16">
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

      {/* Dollar rain — hero only */}
      <DollarRain count={25} />

      {/* ===== TEXT CONTENT — top portion ===== */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-5 sm:px-8 pt-24 sm:pt-28 text-center flex-shrink-0">
        {/* Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2.5 glass px-4 py-2 mb-5 sm:mb-6">
          <div className="w-2 h-2 rounded-full bg-green-500" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
          <span className="text-xs sm:text-sm text-ivory-muted font-medium tracking-wide uppercase">
            150+ traders actifs sur la plateforme
          </span>
        </div>

        {/* Logo */}
        <div ref={logoRef} className="mb-4 sm:mb-5">
          <Image
            src="/logo-hvc-gradient.png"
            alt="High Value Capital"
            width={280}
            height={96}
            className="mx-auto w-32 sm:w-44 md:w-56 h-auto"
            priority
          />
        </div>

        {/* Headline */}
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-4 leading-tight">
          <span className="block">La plateforme pour devenir</span>
          <span className="block">
            <RotatingText
              prefix=""
              words={["rentable", "funded", "discipliné", "profitable"]}
              className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal"
              interval={3000}
            />
            {' '}<span className="text-accent">en trading.</span>
          </span>
        </h1>

        {/* Subline */}
        <p ref={subtitleRef} className="text-sm sm:text-base md:text-lg text-ivory-muted max-w-xl mx-auto mb-6 leading-relaxed font-light">
          Formation, communauté privée, journal de trading IA et outils d&apos;analyse.
          Tout ce qu&apos;il faut pour passer <span className="text-ivory font-medium">funded</span> et rester <span className="text-ivory font-medium">profitable</span>.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
          <MagneticButton
            href={URLS.premium}
            variant="primary"
            className="text-sm sm:text-base"
            onClick={() => { trackEvent('cta_clicked', { location: 'hero' }); trackCheckoutInitiated() }}
          >
            Accéder à la plateforme
            <span className="text-blue-200/70 font-normal">— dès 24,50€/mois</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>

        {/* Trust */}
        <div ref={trustRef} className="flex flex-wrap justify-center gap-3 sm:gap-8 text-ivory-dim text-[11px] sm:text-xs">
          {[
            { icon: Shield, text: 'Journal de trading IA' },
            { icon: Users, text: '150+ membres actifs' },
            { icon: Star, text: 'Partenaires prop firms' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <item.icon className="w-3 h-3 text-accent/70" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SCREENSHOT — flows naturally below text ===== */}
      <div className="relative z-10 mt-6 sm:mt-8 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <CommunityPreview />
        </div>
      </div>

    </section>
  )
}
