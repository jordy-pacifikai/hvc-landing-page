'use client'

import { useState } from 'react'
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
  Star
} from 'lucide-react'

// URLs Heartbeat
const URLS = {
  free: 'https://www.community.highvaluecapital.club/invitation?code=E573F8#landing-page',
  premium: 'https://www.community.highvaluecapital.club/invitation?code=567G8G&price=oneTime#checkout',
  testimonials: 'https://n8n.srv1140766.hstgr.cloud/webhook/testimonials-page'
}

// Composant Hero
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background avec effet */}
      <div className="absolute inset-0 bg-gradient-dark">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hvc-gold rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-hvc-gold rounded-full filter blur-3xl"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo-hvc-white.png"
            alt="High Value Capital"
            width={280}
            height={100}
            className="mx-auto"
            priority
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-hvc-gold/10 border border-hvc-gold/30 rounded-full px-4 py-2 mb-8">
          <Award className="w-4 h-4 text-hvc-gold" />
          <span className="text-sm text-hvc-gold font-medium">7+ Certified Funded Traders</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Tu galeres a etre rentable{' '}
          <span className="text-gradient">en trading ?</span>
        </h1>

        {/* Sous-titre */}
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Decouvre la methode qui a permis a <strong className="text-hvc-gold">7+ membres</strong> de devenir
          Funded Traders et generer <strong className="text-hvc-gold">20,000$+</strong> de payouts.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={URLS.free}
            className="bg-gradient-gold text-hvc-dark font-bold px-8 py-4 rounded-lg text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-hvc-gold/25"
          >
            Commencer Gratuitement
          </a>
          <a
            href={URLS.premium}
            className="border-2 border-hvc-gold text-hvc-gold font-bold px-8 py-4 rounded-lg text-lg hover:bg-hvc-gold/10 transition-all"
          >
            Formation Premium - 97EUR
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-hvc-gold" />
            <span>Garantie 7 jours</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-hvc-gold" />
            <span>150+ membres actifs</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-hvc-gold" />
            <span>Alpha Capital • APEX • BlueberryFunded</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-hvc-gold/50" />
      </div>
    </section>
  )
}

// Composant Stats
function Stats() {
  const stats = [
    { value: '7+', label: 'Funded Traders', icon: Award },
    { value: '20k$+', label: 'Payouts Documentes', icon: DollarSign },
    { value: '150+', label: 'Membres Actifs', icon: Users },
  ]

  return (
    <section className="py-16 bg-hvc-dark border-y border-hvc-gold/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-8 h-8 text-hvc-gold mx-auto mb-3" />
              <div className="text-4xl md:text-5xl font-bold text-hvc-gold mb-2">{stat.value}</div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Composant Probleme
function Problem() {
  const painPoints = [
    "Tu regardes des videos YouTube depuis des mois, mais tu perds toujours de l'argent",
    "Tu as essaye 10 strategies differentes, aucune ne marche vraiment",
    "Tu te sens seul devant tes graphiques, sans personne pour te guider",
    "Tu as crame des comptes propfirm a cause du daily loss ou du revenge trading",
    "Tu comprends la theorie, mais en reel tu paniques et tu fais n'importe quoi",
  ]

  return (
    <section className="py-20 bg-gradient-dark">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Tu te reconnais ?
        </h2>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Si tu ressens au moins une de ces frustrations, tu n'es pas seul.
        </p>

        <div className="space-y-4">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-red-500/5 border border-red-500/20 rounded-lg p-4"
            >
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Composant Agitation
function Agitation() {
  return (
    <section className="py-20 bg-hvc-dark">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Et si rien ne change...
        </h2>

        <div className="bg-hvc-dark-light rounded-2xl p-8 md:p-12 border border-hvc-gold/10">
          <p className="text-xl text-gray-300 mb-6">
            Chaque jour qui passe, tu perds du temps et de l'argent.
          </p>
          <p className="text-lg text-gray-400 mb-6">
            Pendant que tu tournes en rond avec des strategies trouvees sur internet,
            d'autres traders passent leurs challenges et recoivent leurs premiers payouts.
          </p>
          <p className="text-2xl font-bold text-hvc-gold">
            La difference entre eux et toi ?
          </p>
          <p className="text-xl text-white mt-4">
            Ils ont un mentor. Une methode claire. Une communaute qui les pousse.
          </p>
        </div>
      </div>
    </section>
  )
}

// Composant Solution
function Solution() {
  const features = [
    {
      icon: BookOpen,
      title: 'Formation complete',
      description: 'Methode ARD (Accumulation, Recharge, Distribution), zones de liquidite, manipulation, confluences - tout explique etape par etape.'
    },
    {
      icon: Users,
      title: 'Communaute active',
      description: 'Rejoins un groupe de traders sur Heartbeat. Partage de trades quotidien, analyses en temps reel.'
    },
    {
      icon: Video,
      title: 'Sessions live',
      description: 'Je t\'explique mes trades en direct, mes erreurs, mes reussites. Tu apprends en me regardant trader.'
    },
    {
      icon: MessageCircle,
      title: 'Suivi personnalise',
      description: 'Tu peux me poser tes questions directement. Je review tes trades et te guide.'
    },
    {
      icon: FileText,
      title: 'Templates & outils',
      description: 'Checklist pre-trade, journal de trading, templates de backtesting - tout ce qu\'il te faut.'
    },
    {
      icon: TrendingUp,
      title: 'Resultats prouves',
      description: '7+ membres Certified Funded Traders chez Alpha Capital, APEX et BlueberryFunded. 20k$+ de payouts documentes.'
    },
  ]

  return (
    <section className="py-20 bg-gradient-dark">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            High Value Capital : La methode qui transforme les debutants en{' '}
            <span className="text-gradient">Funded Traders</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Je m'appelle Jordy Banks. Je trade depuis 6 ans. J'ai cree HVC parce que j'en avais marre
            de voir des traders galerer avec des formations qui ne marchent pas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-hvc-dark border border-hvc-gold/10 rounded-xl p-6 hover:border-hvc-gold/30 transition-all"
            >
              <feature.icon className="w-10 h-10 text-hvc-gold mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Composant Temoignages
function Testimonials() {
  const testimonials = [
    {
      name: 'Tauraa TEMAEVA',
      badge: 'Funded Trader',
      result: 'Alpha Capital - Oct 2025',
      text: 'Certified Funded Trader chez Alpha Capital Group. Merci a la team et @Jordy Banks pour les concepts qui m\'ont permis de passer le challenge.',
      highlight: true
    },
    {
      name: 'Flores Vista',
      badge: '10,000$ Payout',
      result: 'En 1 mois',
      text: 'En 6 mois avec HVC, j\'ai passe mes challenges 5k, 50k, 100k et accumule 10,000$ de payout. Communaute au top.',
      highlight: true
    },
    {
      name: 'Tehei MT',
      badge: 'Funded',
      result: '6 mois de grind',
      text: 'We did it after 6 months of grind, thanks HVC beast! La perseverance et le suivi de la methode paient toujours.',
      highlight: false
    },
    {
      name: 'Kehaulani Maruhi',
      badge: 'Admin/Funded',
      result: 'APEX Futures - Oct 2025',
      text: 'Funded en futures sur APEX. Maintenant il faut securiser des payouts. Les concepts de liquidite marchent aussi sur les futures!',
      highlight: true
    },
  ]

  return (
    <section className="py-20 bg-hvc-dark">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce qu'ils en disent
          </h2>
          <p className="text-gray-400 text-lg">
            Resultats reels de traders comme toi
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 ${
                testimonial.highlight
                  ? 'bg-gradient-to-br from-hvc-gold/20 to-hvc-gold/5 border border-hvc-gold/30'
                  : 'bg-hvc-dark-light border border-hvc-gold/10'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-hvc-gold text-sm">{testimonial.result}</p>
                </div>
                <span className="bg-hvc-gold text-hvc-dark text-xs font-bold px-3 py-1 rounded-full">
                  {testimonial.badge}
                </span>
              </div>
              <p className="text-gray-300">"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={URLS.testimonials}
            className="text-hvc-gold hover:underline inline-flex items-center gap-2"
          >
            Voir tous les temoignages
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </a>
        </div>
      </div>
    </section>
  )
}

// Composant Pricing
function Pricing() {
  return (
    <section className="py-20 bg-gradient-dark">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choisis ton acces
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Gratuit */}
          <div className="bg-hvc-dark border border-hvc-gold/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-2">Formation Gratuite</h3>
            <div className="text-4xl font-bold text-hvc-gold mb-6">0EUR</div>

            <ul className="space-y-3 mb-8">
              {[
                'Acces a la communaute Heartbeat',
                'Modules de base sur les concepts de liquidite',
                'Acces aux discussions et partages de trades',
                'Support communautaire',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-hvc-gold flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={URLS.free}
              className="block w-full text-center border-2 border-hvc-gold text-hvc-gold font-bold py-4 rounded-lg hover:bg-hvc-gold/10 transition-all"
            >
              Commencer Gratuitement
            </a>
          </div>

          {/* Plan Premium */}
          <div className="bg-gradient-to-br from-hvc-gold/20 to-hvc-gold/5 border-2 border-hvc-gold rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-hvc-gold text-hvc-dark text-sm font-bold px-4 py-1 rounded-full">
                RECOMMANDE
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2">Formation Premium</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-hvc-gold">97EUR</span>
              <span className="text-gray-400">paiement unique</span>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'TOUT ce qui est inclus dans la formation gratuite',
                'Formation complete avancee (20+ heures)',
                'Acces au groupe Premium prive',
                'Sessions live hebdomadaires',
                'Analyses de trades personnalisees',
                'Templates et outils exclusifs',
                'Acces a vie + mises a jour',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-hvc-gold flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={URLS.premium}
              className="block w-full text-center bg-gradient-gold text-hvc-dark font-bold py-4 rounded-lg hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg shadow-hvc-gold/25"
            >
              Rejoindre Premium - 97EUR
            </a>

            <p className="text-center text-sm text-gray-400 mt-4">
              95% de nos Funded Traders ont choisi cette option
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Composant Garantie
function Guarantee() {
  return (
    <section className="py-16 bg-hvc-dark">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <Shield className="w-16 h-16 text-hvc-gold mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Essaie sans risque
        </h2>
        <p className="text-gray-300 text-lg mb-4">
          Tu peux tester la formation Premium pendant <strong className="text-hvc-gold">7 jours</strong>.
        </p>
        <p className="text-gray-400">
          Si tu n'es pas satisfait, tu me contactes et je te rembourse.
          Pas de questions. Pas de justification.
        </p>
      </div>
    </section>
  )
}

// Composant FAQ
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "C'est quoi exactement la methode ARD ?",
      answer: "C'est la methode ARD (Accumulation, Recharge, Distribution) - une approche qui permet de comprendre ou les institutions placent leurs ordres. Au lieu de suivre des indicateurs en retard, tu apprends a lire le marche comme les pros."
    },
    {
      question: "Combien de temps avant de voir des resultats ?",
      answer: "Ca depend de ton engagement. Certains membres passent leurs premiers challenges en 3-6 mois. D'autres prennent plus de temps. L'important c'est de progresser chaque jour."
    },
    {
      question: "J'ai deja essaye d'autres formations, pourquoi celle-ci serait differente ?",
      answer: "Parce qu'on a des resultats concrets : 7+ Funded Traders chez Alpha Capital, APEX et BlueberryFunded. 20k$+ de payouts documentes. Et surtout, une communaute active qui partage ses trades tous les jours."
    },
    {
      question: "Est-ce que ca marche pour les debutants complets ?",
      answer: "Oui. La formation part de zero. Mais tu dois etre pret a apprendre et a pratiquer serieusement."
    },
    {
      question: "Je travaille a cote, j'ai pas beaucoup de temps...",
      answer: "Beaucoup de nos membres ont un job. Tu peux trader la session London le soir ou te concentrer sur les setups daily/weekly. La methode s'adapte a ton emploi du temps."
    },
  ]

  return (
    <section className="py-20 bg-gradient-dark">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Questions frequentes
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-hvc-dark border border-hvc-gold/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-hvc-gold/5 transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-hvc-gold flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-hvc-gold flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Composant CTA Final
function FinalCTA() {
  return (
    <section className="py-20 bg-hvc-dark">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Arrete de galerer seul.
        </h2>
        <p className="text-xl text-hvc-gold mb-8">
          Rejoins une communaute qui obtient des resultats.
        </p>

        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
          Tu as deux choix : continuer a chercher des strategies sur YouTube et perdre encore
          des mois a tourner en rond. Ou rejoindre High Value Capital et avoir une communaute
          qui te soutient jusqu'a ton premier payout.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={URLS.free}
            className="border-2 border-hvc-gold text-hvc-gold font-bold px-8 py-4 rounded-lg text-lg hover:bg-hvc-gold/10 transition-all"
          >
            Commencer Gratuitement
          </a>
          <a
            href={URLS.premium}
            className="bg-gradient-gold text-hvc-dark font-bold px-8 py-4 rounded-lg text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-hvc-gold/25"
          >
            Rejoindre Premium - 97EUR
          </a>
        </div>
      </div>
    </section>
  )
}

// Composant Footer
function Footer() {
  return (
    <footer className="py-8 bg-black/50 border-t border-hvc-gold/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <Image
              src="/icon-hvc-white.png"
              alt="High Value Capital"
              width={50}
              height={50}
              className="mx-auto md:mx-0 mb-2"
            />
            <p className="text-gray-500 text-sm">Formation Trading Forex</p>
          </div>

          <p className="text-gray-500 text-xs text-center max-w-md">
            Le trading comporte des risques. Les resultats passes ne garantissent pas les resultats futurs.
            Investis uniquement ce que tu peux te permettre de perdre.
          </p>

          <p className="text-gray-600 text-sm">
            2026 High Value Capital
          </p>
        </div>
      </div>
    </footer>
  )
}

// Page principale
export default function Home() {
  return (
    <main>
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
