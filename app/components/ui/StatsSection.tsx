'use client'

import { useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Award, DollarSign, Users } from 'lucide-react'
import SectionReveal from '../effects/SectionReveal'
import GlassCard from '../effects/GlassCard'

gsap.registerPlugin(ScrollTrigger)

function AnimatedCounter({ end, suffix, active }: { end: number; suffix: string; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  if (active && !animated.current && ref.current) {
    animated.current = true
    gsap.to({ val: 0 }, {
      val: end,
      duration: 2,
      ease: "power2.out",
      onUpdate: function () {
        if (ref.current) ref.current.textContent = Math.round(this.targets()[0].val) + suffix
      }
    })
  }

  return <span ref={ref} className="font-display text-display-md text-shimmer tabular-nums">0{suffix}</span>
}

export default function StatsSection() {
  const [active, setActive] = useState(false)

  const stats = [
    { end: 15, suffix: '+', label: 'Funded Traders', icon: Award },
    { end: 85, suffix: 'k$+', label: 'Payouts documentés', icon: DollarSign },
    { end: 150, suffix: '+', label: 'Membres actifs', icon: Users },
  ]

  const handleReveal = useCallback(() => setActive(true), [])

  return (
    <section className="py-section relative">
      <SectionReveal className="max-w-5xl mx-auto px-5 sm:px-8" onReveal={handleReveal}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="reveal-child">
              <GlassCard className="text-center py-10 px-6">
                <s.icon className="w-8 h-8 text-accent mx-auto mb-5 opacity-80" />
                <div className="mb-2">
                  <AnimatedCounter end={s.end} suffix={s.suffix} active={active} />
                </div>
                <div className="text-ivory-dim text-sm uppercase tracking-wider">{s.label}</div>
              </GlassCard>
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  )
}
