'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  Award,
  Users,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Filter,
  ExternalLink
} from 'lucide-react'

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

// Données des témoignages importées depuis Airtable
const testimonials = [
  {
    id: 'rec0a48lU7Sbi3S09',
    name: 'Flores Vista',
    result: '10,000$ payout en 1 mois',
    type: 'Message Heartbeat',
    category: 'payout',
    text: "En 6 mois avec HVC, j'ai passé mes challenges 5k, 50k, 100k et accumulé 10,000$ de payout. Communauté au top, la plateforme est super efficace et active. Merci pour cette opportunité et ce changement de vie.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/isw2ak0k14cifkjd2sbxr/Flores_Vista.png?rlkey=d5sf7ec1hf7njkyvqq22e1hew&raw=1',
    impactScore: 9
  },
  {
    id: 'rec683ifFoWeg8vyM',
    name: 'Tamatoa Tehahe',
    result: 'Alpha Capital Funded Trader',
    type: 'Certificat Firme',
    category: 'funded',
    text: "Certified Funded Trader chez Alpha Capital Group. La gestion du capital, la gestion du risque, et la rentabilité de ma stratégie ont été prouvées pendant l'évaluation.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/6qw9prl0thsx0ya8vpshg/Tamatoa.jpg?rlkey=iwzdr3ofe4820tlnpqudek2qh&raw=1',
    impactScore: 10
  },
  {
    id: 'recF840sGrRqfZ05t',
    name: 'Pecheret Manoarii',
    result: 'Alpha Capital Funded Trader',
    type: 'Certificat Firme',
    category: 'funded',
    text: "J'ai réussi l'évaluation Alpha Capital Group. J'ai démontré ma capacité à gérer le capital, gérer le risque efficacement, et la rentabilité de ma stratégie a été établie.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/323ssun374k8j6c54a9jb/Pecheret.JPG?rlkey=xspd8wyozvqxa5dj9qq0bj9ux&raw=1',
    impactScore: 10
  },
  {
    id: 'reco3BDzoF6Ecu1s6',
    name: 'Ariinohoare Teahu',
    result: 'Alpha Capital Funded Trader',
    type: 'Certificat Firme',
    category: 'funded',
    text: "J'ai réussi l'évaluation Alpha Capital Group en mars 2024. J'ai démontré ma capacité à gérer le capital, gérer le risque, et ma stratégie s'est révélée profitable.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/makmzpjoeceuvdgzz79ik/Ariinohoare_Teahu_cert.JPG?rlkey=abzc7cgkinz5khc2qm2fg7nbe&raw=1',
    impactScore: 10
  },
  {
    id: 'recYm0ryE4fwBsTYF',
    name: 'Raitini',
    result: 'Alpha Capital Funded Trader',
    type: 'Certificat Firme',
    category: 'funded',
    text: "J'ai réussi l'évaluation Alpha Capital Group et je suis désormais un Certified Funded Trader. Grâce à High Value Capital, j'ai développé les compétences nécessaires.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/0m8apdd5iugu2efkrg2gp/Raitini.jpg?rlkey=dwhap4v8v9w9jomvp6004ufoh&raw=1',
    impactScore: 10
  },
  {
    id: 'recbbQLeM78XJGDeS',
    name: 'Taahitini Taero',
    result: 'Alpha Capital Funded Trader',
    type: 'Certificat Firme',
    category: 'funded',
    text: "J'ai réussi l'évaluation Alpha Capital Group en décembre 2024. Je suis maintenant un Certified Funded Trader. Les concepts HVC m'ont permis de passer le challenge.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/tt82x39n86koopakja3gv/Taahitini_Taero_cert.png?rlkey=00fpf97au541gwte0or2wm4sh&raw=1',
    impactScore: 10
  },
  {
    id: 'recExDYCiID8QXNx1',
    name: 'Aro Sama',
    result: 'Validation phase 2 du 2ème compte 10k',
    type: 'Screenshot résultats',
    category: 'funded',
    text: "Je viens de valider la phase 2 de mon deuxième compte 10k. Sur ma capture d'écran, vous voyez mon analyse GBPJPY avec les zones de liquidité parfaitement identifiées.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/hlen7ctujxqgeswqo184p/Aro_Sama_cert.JPG?rlkey=84rt7rivm9xa3p2b6rfrvy6bj&raw=1',
    impactScore: 10
  },
  {
    id: 'recMpW2jtKqsiXqyH',
    name: 'R Rai',
    result: 'Compte 100k financé + payout 7k$',
    type: 'Message Heartbeat',
    category: 'payout',
    text: "Les formations m'ont beaucoup aidé, la team super. L'esprit d'équipe m'a permis de découvrir les propfirm et obtenir un compte financé à 100k et un payout de 7k dollars.",
    screenshot: 'https://www.dropbox.com/scl/fo/8rambyfyuwfrifbqyhrwx/ALLhEerbQr_oUoVoanbPLK0/CleanShot%202024-06-22%20at%2020.05.37%402x.png?rlkey=8ftiui84sg2moc01rtis8f44s&raw=1',
    impactScore: 9
  },
  {
    id: 'recHsw8CLlmT0J49T',
    name: 'Clayton LI',
    result: '34 Risk-Reward cumulés',
    type: 'Screenshot résultats',
    category: 'results',
    text: "J'accumule 34 Risk-Reward sur mes trades. Ma stratégie montre une maîtrise exceptionnelle du money management grâce aux concepts HVC.",
    screenshot: 'https://www.dropbox.com/scl/fo/8rambyfyuwfrifbqyhrwx/AJoMPzURJalasNQaYVYVOnM/CleanShot%202024-06-22%20at%2020.07.10%402x.png?rlkey=8ftiui84sg2moc01rtis8f44s&raw=1',
    impactScore: 9
  },
  {
    id: 'rec6wMP9up5k7uEg7',
    name: 'Aro S',
    result: 'Première propfirm validée',
    type: 'Message Heartbeat',
    category: 'funded',
    text: "Les résultats parlent. J'ai validé ma première propfirm après des mois d'échecs. Le partage en groupe m'aide beaucoup. Ça a dépassé toutes mes attentes.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/wd6m0omei0ykqagqmtxky/Aro_S.png?rlkey=wdh6wpe8bz9adyq18px4kbviz&raw=1',
    impactScore: 8
  },
  {
    id: 'recSPOPySkQV6oKMV',
    name: 'Le V',
    result: 'Compte 50k validé',
    type: 'Message Heartbeat',
    category: 'funded',
    text: "La communauté est au top et la stratégie fonctionne parfaitement. J'ai pu enfin valider un compte à 50k. Je recommande vraiment la formation.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/5poknkffe8limudedsfnf/Le_V_message.png?rlkey=hcd55squw6xu5oyjx9oc01gb3&raw=1',
    impactScore: 9
  },
  {
    id: 'recHB4BMGKnhzn9Qm',
    name: 'Manutea',
    result: 'Compte TradeLocker financé',
    type: 'Message Heartbeat',
    category: 'funded',
    text: "J'étais à un point où je voulais abandonner. Heureusement j'ai revu la formation, surtout les vidéos sur le backtesting. Ça m'a redonné confiance. Maintenant je suis financé.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/o7c0fxfp7gimvfkcwnq7s/Manutea.PNG?rlkey=fjq6ps1rceh3v5esn1fkqgxgr&raw=1',
    impactScore: 8
  },
  {
    id: 'receRcBhpjr9CMKaX',
    name: 'Piitau H',
    result: 'Challenge 5K: 300$/500$ (60%)',
    type: 'Message Heartbeat',
    category: 'progress',
    text: "J'ai beaucoup appris grâce à vous. Je suis à 300$ sur les 500$ requis après un trade gagnant sur USDCAD. C'est juste mon mindset que j'améliore encore.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/s9gsn40k1khxcs38mnbop/Piitau_H_message.png?rlkey=6zdzfm31tkbwd5xyfdxcqfkow&raw=1',
    impactScore: 8
  },
  {
    id: 'rec9X5QP09Qdper1p',
    name: 'Kehauri Toa',
    result: "1+ an d'apprentissage en quelques mois",
    type: 'Message Heartbeat',
    category: 'learning',
    text: "Depuis que je vous ai rejoint, j'ai appris tellement plus qu'en 1 an et demi sur internet. J'ai aussi pu me trouver une stratégie à moi-même.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/8fjcc8wcq3i0qwjjfde06/Kehauri_Toa.png?rlkey=fktl2oubgwifk2lrtn6o7u05f&raw=1',
    impactScore: 8
  },
  {
    id: 'reczfTJsgTDnYgEEb',
    name: 'Rainui RIMAONO',
    result: 'Remonté de -400$ à +50$',
    type: 'Message Heartbeat',
    category: 'progress',
    text: "J'ai failli perdre mon challenge avec 400$ de perte en juin, mais je suis remonté à +50$ en juillet. J'ai des objectifs, donc je lâche rien.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/9hcej678128yvv813m4oe/Rainui_RIMAONO.png?rlkey=tnc9a3a0m4ht72582nr6cf5c8&raw=1',
    impactScore: 7
  },
  {
    id: 'recidTxf0jiWq9STM',
    name: 'Hei Mana',
    result: 'Repris goût au trading en 1 mois',
    type: 'Message Heartbeat',
    category: 'learning',
    text: "Après 1 an en autodidacte, j'ai rejoint HVC. En 1 mois, j'ai retrouvé ma motivation. La communauté où chacun partage sa vision m'a inspiré à ne jamais rien lâcher.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/xgw9zo2r8elggzpxafhqi/Hei_Mana.png?rlkey=pl9mevkl5tvoirgbdpqvmgouk&raw=1',
    impactScore: 7
  },
  {
    id: 'recPcbCeI9om2MKkL',
    name: 'Adam',
    result: 'Retour après abandon, analyses correctes',
    type: 'Message Heartbeat',
    category: 'progress',
    text: "J'avais abandonné car pas de résultats. Le mois dernier je me suis repris et mes analyses sont de plus en plus correctes en pratiquant.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/vca7hhc8mq30ftjm31mvj/Adam.png?rlkey=jvirh5pmi68dbapj8zcaf75s5&raw=1',
    impactScore: 7
  },
  {
    id: 'recr4EqDMSdpy4D0w',
    name: 'Torea Barsinas',
    result: 'Maîtrise des Zones de Recharge',
    type: 'Message Heartbeat',
    category: 'learning',
    text: "J'ai petit à petit maîtrisé les concepts, notamment les Zones de Recharge. La communauté est vraiment bienveillante. Je ne regrette vraiment pas d'être entré.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/zxbobkfblwual9ipwh4zi/Torea_Barsinas.png?rlkey=k3ajnjio9ra1wlrk6wgb4zo0u&raw=1',
    impactScore: 7
  },
  {
    id: 'recCpRi0t0iqEfos6',
    name: 'Temanu',
    result: 'Formation excellente + groupe motivant',
    type: 'Message Heartbeat',
    category: 'learning',
    text: "Mon expérience est super. La formation est excellente, il faut juste bien tout assimiler et appliquer. Le groupe m'inspire avec beaucoup de réussites.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/gmy31rja4cd7fnr11yxc3/Temanu.png?rlkey=gxu5wva73et1ob1pw2h7acyi3&raw=1',
    impactScore: 6
  },
  {
    id: 'recCjChvA28dpGSgU',
    name: 'Mano B',
    result: '4 mois de progression',
    type: 'Message Heartbeat',
    category: 'learning',
    text: "En 4 mois, HVC m'a donné tout ce dont j'avais besoin: un mentor, une formation, une communauté. J'avais commencé sur YouTube mais je stagnais.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/luvn17pvyiec5mgdwtqzi/Mano_B.png?rlkey=rolqscqxooreb55zyltdt85p5&raw=1',
    impactScore: 6
  },
  {
    id: 'recXLsfvoQKqyzkRI',
    name: 'Toerau HMN',
    result: 'Nouveau compte Alpha Capital',
    type: 'Message Heartbeat',
    category: 'progress',
    text: "Je viens de prendre un compte chez Alpha Capital. Je sens que ça commence à payer après des mois à suivre vos formations et vos analyses.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/23bp59u56lhtwwv8hrr1b/Toerau_HMN.png?rlkey=q4egl5o7iyinmbno94dxe2cj6&raw=1',
    impactScore: 6
  },
  {
    id: 'recmuXF1xUGdpGs5G',
    name: 'Ismael Thomas',
    result: 'Connaissances + Force psychologique',
    type: 'Message Heartbeat',
    category: 'learning',
    text: "Mon expérience m'a beaucoup apporté, en connaissance et pour me durcir psychologiquement. J'avance doucement mais sûrement avec mon challenge.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/5wy7vkkeb6k75fnjo9tn5/Ismael_Thomas.png?rlkey=uizuy73ohcvmxgfwqpz8s60nu&raw=1',
    impactScore: 6
  },
  {
    id: 'recsyoRVsJcnTatt9',
    name: 'Hitinui VANAA',
    result: 'Maîtrise des zones de recharge',
    type: 'Message Heartbeat',
    category: 'learning',
    text: "Niveau concept c'est bon, j'arrive à bien repérer les zones de recharge grâce à vos trade-explications. Maintenant c'est psychologie et patience.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/3o6ryy2kaw4hlni1pau83/Hitinui_VANAA.png?rlkey=5rubv9uwbyopt62ztebujl2jk&raw=1',
    impactScore: 6
  },
  {
    id: 'recxxoHLbbmTA0qUi',
    name: 'Teraimoana TAURAA',
    result: 'Amélioration massive',
    type: 'Message Heartbeat',
    category: 'progress',
    text: "Ça va méga bien le trading ! J'ai beaucoup amélioré depuis mon entrée chez HVC. J'ai fait 2 essais propfirm, 2 fails au daily loss, mais je perds pas espoir !",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/beyn6scob82x0xjwh5g7o/Teraimoana_TAURAA.png?rlkey=hv866bxrouylfsosicdg2nhzt&raw=1',
    impactScore: 5
  },
  {
    id: 'recrBsAr95zJml0vX',
    name: 'Tutex Tnr',
    result: 'Formation de qualité',
    type: 'Message Heartbeat',
    category: 'learning',
    text: "Merci pour toutes vos vidéos de formation, c'est nickel ! L'expérience est incroyable, tout le monde est à fond, ça donne envie de se donner à fond aussi.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/z7s5gcidm7hkr5snjyxkg/Tutex_Tnr.png?rlkey=4yub6lvt2pkqwic5io4g5r&raw=1',
    impactScore: 5
  },
  {
    id: 'recgK0Yu0hie0MdzN',
    name: 'Ryan Clark',
    result: 'Formation très instructive',
    type: 'Message Heartbeat',
    category: 'learning',
    text: "Je dirais très instructif, j'ai appris plein de choses et j'en apprends encore davantage. Maururu encore pour l'adhésion !",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/ogzqnt4rb3suyu6r3z54w/Ryan_Clark.png?rlkey=3u9p6gncyn86id36rrblqnwk5&raw=1',
    impactScore: 5
  },
  {
    id: 'rec5q0vUpufnlr9lX',
    name: 'Ariimoana TAAROA',
    result: 'Explications claires',
    type: 'Message Heartbeat',
    category: 'learning',
    text: "Tout est clair dans tes explications, j'ai bien appris grâce à ta formation c'est sans doute. Je reviendrai bientôt après ma pause.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/3zwx6wvs1ylo8qe83qgt7/Ariimoana_TAAROA.png?rlkey=sp0f9n8ymjfkyubu9c6b0oadg&raw=1',
    impactScore: 4
  },
  {
    id: 'recOyMFLsN2Ik2esQ',
    name: 'Tahimana Williams',
    result: 'Progression solide',
    type: 'Message Heartbeat',
    category: 'learning',
    text: "Le trading se passe très bien. Militaire en sentinelle, pas évident de trader, mais j'envisage de prendre des permissions pour être à fond dedans.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/60ehhmbu7kekmu13h9umx/Tahimana_Williams.png?rlkey=3m9b9h074zab4q9dr7sw6z4kw&raw=1',
    impactScore: 4
  }
]

// Stats calculées
const stats = [
  { value: '7+', label: 'Funded Traders', icon: Award },
  { value: '20k$+', label: 'Payouts Documentés', icon: DollarSign },
  { value: '30+', label: 'Témoignages', icon: Users },
]

// Filtres disponibles
const filters = [
  { key: 'all', label: 'Tous', count: testimonials.length },
  { key: 'funded', label: 'Funded', count: testimonials.filter(t => t.category === 'funded').length },
  { key: 'payout', label: 'Payouts', count: testimonials.filter(t => t.category === 'payout').length },
  { key: 'progress', label: 'En cours', count: testimonials.filter(t => t.category === 'progress').length },
  { key: 'learning', label: 'Apprentissage', count: testimonials.filter(t => t.category === 'learning').length },
]

export default function TestimonialsPage() {
  const [filter, setFilter] = useState<string>('all')
  const [showScreenshots, setShowScreenshots] = useState(true)

  const filteredTestimonials = filter === 'all'
    ? testimonials
    : testimonials.filter(t => t.category === filter)

  // Trier par impact score
  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => b.impactScore - a.impactScore)

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
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-glass border border-champagne/20 rounded-full px-5 py-2.5 mb-8">
            <Star className="w-4 h-4 text-champagne" />
            <span className="text-champagne text-sm font-medium">RÉSULTATS RÉELS</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium mb-6 leading-[1.1]">
            Ce qu'ils en{' '}
            <span className="italic text-gradient-gold">disent</span>
          </h1>

          <p className="text-xl text-mist mb-8 max-w-2xl mx-auto leading-relaxed">
            <span className="text-champagne font-medium">{testimonials.length} témoignages</span> de traders
            qui ont rejoint High Value Capital et obtenu des résultats concrets.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 md:p-6 rounded-2xl bg-glass border border-champagne/10"
              >
                <stat.icon className="w-6 md:w-8 h-6 md:h-8 text-champagne mx-auto mb-2 md:mb-3" />
                <div className="font-display text-2xl md:text-4xl font-medium text-gradient-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-mist text-xs md:text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* Filtres */}
      <section className="py-6 px-6 sticky top-[73px] z-40 bg-void/90 backdrop-blur-xl border-b border-champagne/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  filter === f.key
                    ? 'bg-gradient-gold text-void'
                    : 'bg-glass border border-champagne/20 text-mist hover:text-champagne hover:border-champagne/40'
                }`}
              >
                {f.label}
                <span className={`text-xs ${filter === f.key ? 'text-void/70' : 'text-mist/50'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Toggle Screenshots */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowScreenshots(!showScreenshots)}
              className="text-sm text-mist hover:text-champagne transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showScreenshots ? 'Masquer les screenshots' : 'Afficher les screenshots'}
            </button>
          </div>
        </div>
      </section>

      {/* Grille de témoignages */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {sortedTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                  testimonial.impactScore >= 9
                    ? 'card-highlight glow-gold'
                    : 'card'
                }`}
              >
                {/* Screenshot */}
                {showScreenshots && testimonial.screenshot && (
                  <div className="relative w-full h-48 md:h-56 bg-charcoal overflow-hidden">
                    <img
                      src={testimonial.screenshot}
                      alt={`Témoignage de ${testimonial.name}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    <a
                      href={testimonial.screenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 p-2 bg-void/80 rounded-lg hover:bg-void transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-champagne" />
                    </a>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-xl font-medium text-ivory">
                        {testimonial.name}
                      </h3>
                      <p className="text-champagne text-sm mt-1">
                        {testimonial.result}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${
                      testimonial.category === 'payout'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : testimonial.category === 'funded'
                        ? 'bg-gradient-gold text-void'
                        : testimonial.category === 'progress'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-champagne/10 text-champagne border border-champagne/20'
                    }`}>
                      {testimonial.category === 'funded' ? 'Funded' :
                       testimonial.category === 'payout' ? 'Payout' :
                       testimonial.category === 'progress' ? 'En cours' : 'Apprentissage'}
                    </span>
                  </div>

                  {/* Text */}
                  <p className="text-pearl leading-relaxed text-sm md:text-base">
                    "{testimonial.text}"
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-champagne/10">
                    <span className="text-smoke text-xs">{testimonial.type}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.round(testimonial.impactScore / 2)
                              ? 'text-champagne fill-champagne'
                              : 'text-champagne/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* CTA Final */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
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
