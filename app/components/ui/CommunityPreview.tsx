'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedCounter({ target, prefix = '', suffix = '', decimals = 0 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number
}) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1800
          const startTime = performance.now()
          function tick(now: number) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(eased * target)
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  const display = decimals > 0
    ? value.toFixed(decimals)
    : Math.floor(value).toLocaleString('fr-FR')

  return <span ref={ref}>{prefix}{display}{suffix}</span>
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CommunityPreview() {
  const tiltRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current || window.innerWidth < 768) return
    const rect = tiltRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    tiltRef.current.style.transform = `perspective(1200px) rotateX(${8 + y * -3}deg) rotateY(${x * 4}deg) scale3d(1.01, 1.01, 1.01)`
    // Spotlight follow
    tiltRef.current.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`)
    tiltRef.current.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!tiltRef.current) return
    tiltRef.current.style.transform = 'perspective(1200px) rotateX(8deg) rotateY(0deg) scale3d(1,1,1)'
  }, [])

  // GSAP staggered entrance
  useEffect(() => {
    if (!wrapperRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Screenshot enters first
      gsap.from('.cp-screenshot', {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top 85%',
        },
      })

      // Floating cards stagger in after
      gsap.from('.cp-float-card', {
        y: 30,
        opacity: 0,
        scale: 0.85,
        duration: 0.7,
        ease: 'back.out(1.4)',
        stagger: 0.15,
        delay: 0.4,
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top 85%',
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      {/* ─── Floating Feature Cards ─── */}

      {/* Top-left: Journal de Trading IA */}
      <div className="cp-float-card absolute z-30 hidden md:flex items-center gap-3 px-4 py-3 rounded-xl
        bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{ top: '6%', left: '-4%', animation: 'cp-float-1 4.5s ease-in-out infinite' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'rgba(37,99,235,0.15)', color: '#60A5FA' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </div>
        <div>
          <p className="text-xs font-medium text-white">Journal de Trading IA</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Analyse automatique de tes trades
          </p>
        </div>
      </div>

      {/* Top-right: Formation complète */}
      <div className="cp-float-card absolute z-30 hidden md:flex items-center gap-3 px-4 py-3 rounded-xl
        bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{ top: '10%', right: '-3%', animation: 'cp-float-2 5s ease-in-out infinite 0.5s' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
        </div>
        <div>
          <p className="text-xs font-medium text-white">
            <AnimatedCounter target={42} /> lecons
          </p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Formation structuree de A a Z
          </p>
        </div>
      </div>

      {/* Mid-left: Communauté Discord */}
      <div className="cp-float-card absolute z-30 hidden lg:flex items-center gap-3 px-4 py-3 rounded-xl
        bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{ top: '42%', left: '-6%', animation: 'cp-float-3 4s ease-in-out infinite 1s' }}
      >
        <div className="flex -space-x-2">
          {['#6366f1', '#2563EB', '#60A5FA', '#22c55e'].map((c, i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2"
              style={{ background: c, borderColor: 'rgba(10,10,10,0.9)', zIndex: 4 - i }} />
          ))}
        </div>
        <div>
          <p className="text-xs font-medium text-white">
            <AnimatedCounter target={150} suffix="+" /> membres
          </p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Communaute privee Discord
          </p>
        </div>
      </div>

      {/* Mid-right: Calendrier économique */}
      <div className="cp-float-card absolute z-30 hidden lg:flex items-center gap-3 px-4 py-3 rounded-xl
        bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{ top: '48%', right: '-5%', animation: 'cp-float-1 4.8s ease-in-out infinite 1.5s' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'rgba(96,165,250,0.15)', color: '#60A5FA' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div>
          <p className="text-xs font-medium text-white">Calendrier economique</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Evenements marche en temps reel
          </p>
        </div>
      </div>

      {/* Bottom-left: Explications de trades */}
      <div className="cp-float-card absolute z-30 hidden md:flex items-center gap-3 px-4 py-3 rounded-xl
        bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{ bottom: '20%', left: '-3%', animation: 'cp-float-2 4.2s ease-in-out infinite 0.8s' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div>
          <p className="text-xs font-medium text-white">Explications de trades</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Chaque setup decortique en detail
          </p>
        </div>
      </div>

      {/* Bottom-right: Giveaways */}
      <div className="cp-float-card absolute z-30 hidden md:flex items-center gap-3 px-4 py-3 rounded-xl
        bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{ bottom: '15%', right: '-4%', animation: 'cp-float-3 5.2s ease-in-out infinite 2s' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <div>
          <p className="text-xs font-medium text-white">Giveaways</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Comptes prop firm a gagner chaque mois
          </p>
        </div>
      </div>

      {/* ─── Screenshot with browser chrome ─── */}
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cp-screenshot relative z-10 transition-transform duration-300 ease-out will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'perspective(1200px) rotateX(8deg)',
        }}
      >
        {/* Breathing glow behind */}
        <div className="absolute -inset-6 sm:-inset-10 z-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.2) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'cp-glow-breathe 6s ease-in-out infinite',
          }}
        />

        {/* Rotating gradient border */}
        <div className="relative z-10 rounded-2xl p-[1.5px] cp-animated-border"
          style={{
            boxShadow: '0 0 0 1px rgba(37,99,235,0.05), 0 25px 60px -12px rgba(37,99,235,0.3), 0 50px 100px -20px rgba(0,0,0,0.5)',
          }}
        >
          <div className="rounded-[15px] overflow-hidden" style={{ background: 'var(--black-card)' }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-3 sm:px-4 py-2 border-b" style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.06)',
            }}>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 rounded-md px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}
              >
                community.highvaluecapital.club
              </div>
            </div>

            {/* Screenshot */}
            <div className="relative leading-[0] overflow-hidden">
              <Image
                src="/community-preview.jpg"
                alt="High Value Capital — Communauté de trading avec journal et statistiques"
                width={1920}
                height={1246}
                className="w-full h-auto"
                priority
              />

              {/* Spotlight overlay (follows cursor) */}
              <div className="absolute inset-0 z-10 pointer-events-none opacity-0 hover-parent-spotlight"
                style={{
                  background: 'radial-gradient(400px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(37,99,235,0.08), transparent 70%)',
                }}
              />

              {/* Shine sweep */}
              <div className="absolute inset-0 z-11 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 55%, transparent 60%)',
                  animation: 'community-shine 6s ease-in-out infinite',
                  animationDelay: '2s',
                }}
              />

              {/* Scan line — "live data" feel */}
              <div className="absolute left-0 right-0 z-12 pointer-events-none"
                style={{
                  height: 1,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.4) 30%, rgba(99,102,241,0.6) 50%, rgba(37,99,235,0.4) 70%, transparent 100%)',
                  boxShadow: '0 0 8px rgba(37,99,235,0.3)',
                  animation: 'cp-scanline 6s ease-in-out infinite 3s',
                }}
              />

              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-36 z-20 pointer-events-none"
                style={{ background: 'linear-gradient(to top, var(--black), transparent)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
