'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { captureUTM } from './lib/utm'

import HeroSection from './components/ui/HeroSection'
import StatsSection from './components/ui/StatsSection'
import ProblemSection from './components/ui/ProblemSection'
import AgitationSection from './components/ui/AgitationSection'
import SolutionSection from './components/ui/SolutionSection'
import TestimonialsSection from './components/ui/TestimonialsSection'
import PartnersSection from './components/ui/PartnersSection'
import PricingSection from './components/ui/PricingSection'
import GuaranteeSection from './components/ui/GuaranteeSection'
import FAQSection from './components/ui/FAQSection'
import FinalCTASection from './components/ui/FinalCTASection'
import NewsletterSection from './components/ui/NewsletterSection'
import FooterSection from './components/ui/FooterSection'

const ChatWidget = dynamic(() => import('./components/ChatWidget'), { ssr: false })

export default function Home() {
  useEffect(() => { captureUTM() }, [])

  return (
    <main className="relative overflow-x-hidden w-full">
      <div className="noise-overlay" />
      <ChatWidget />
      <HeroSection />
      <StatsSection />
      <ProblemSection />
      <AgitationSection />
      <SolutionSection />
      <TestimonialsSection />
      <PartnersSection />
      <PricingSection />
      <GuaranteeSection />
      <FAQSection />
      <FinalCTASection />
      <NewsletterSection />
      <FooterSection />
    </main>
  )
}
