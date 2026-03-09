'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Award,
  Users,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  X,
} from 'lucide-react'

const testimonials = [
  {
    id: 'rec0a48lU7Sbi3S09',
    name: 'Flores Vista',
    result: '10,000$ payout en 1 mois',
    type: 'Message Discord',
    category: 'payout',
    text: "En 6 mois avec HVC, j'ai passe mes challenges 5k, 50k, 100k et accumule 10,000$ de payout. Communaute au top, la plateforme est super efficace et active. Merci pour cette opportunite et ce changement de vie.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/isw2ak0k14cifkjd2sbxr/Flores_Vista.png?rlkey=d5sf7ec1hf7njkyvqq22e1hew&raw=1',
    impactScore: 9
  },
  {
    id: 'rec683ifFoWeg8vyM',
    name: 'Tamatoa Tehahe',
    result: 'Alpha Capital Funded Trader',
    type: 'Certificat Firme',
    category: 'funded',
    text: "Certified Funded Trader chez Alpha Capital Group. La gestion du capital, la gestion du risque, et la rentabilite de ma strategie ont ete prouvees pendant l'evaluation.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/6qw9prl0thsx0ya8vpshg/Tamatoa.jpg?rlkey=iwzdr3ofe4820tlnpqudek2qh&raw=1',
    impactScore: 10
  },
  {
    id: 'recF840sGrRqfZ05t',
    name: 'Pecheret Manoarii',
    result: 'Alpha Capital Funded Trader',
    type: 'Certificat Firme',
    category: 'funded',
    text: "J'ai reussi l'evaluation Alpha Capital Group. J'ai demontre ma capacite a gerer le capital, gerer le risque efficacement, et la rentabilite de ma strategie a ete etablie.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/323ssun374k8j6c54a9jb/Pecheret.JPG?rlkey=xspd8wyozvqxa5dj9qq0bj9ux&raw=1',
    impactScore: 10
  },
  {
    id: 'reco3BDzoF6Ecu1s6',
    name: 'Ariinohoare Teahu',
    result: 'Alpha Capital Funded Trader',
    type: 'Certificat Firme',
    category: 'funded',
    text: "J'ai reussi l'evaluation Alpha Capital Group en mars 2024. J'ai demontre ma capacite a gerer le capital, gerer le risque, et ma strategie s'est revelee profitable.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/makmzpjoeceuvdgzz79ik/Ariinohoare_Teahu_cert.JPG?rlkey=abzc7cgkinz5khc2qm2fg7nbe&raw=1',
    impactScore: 10
  },
  {
    id: 'recYm0ryE4fwBsTYF',
    name: 'Raitini',
    result: 'Alpha Capital Funded Trader',
    type: 'Certificat Firme',
    category: 'funded',
    text: "J'ai reussi l'evaluation Alpha Capital Group et je suis desormais un Certified Funded Trader. Grace a High Value Capital, j'ai developpe les competences necessaires.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/0m8apdd5iugu2efkrg2gp/Raitini.jpg?rlkey=dwhap4v8v9w9jomvp6004ufoh&raw=1',
    impactScore: 10
  },
  {
    id: 'recbbQLeM78XJGDeS',
    name: 'Taahitini Taero',
    result: 'Alpha Capital Funded Trader',
    type: 'Certificat Firme',
    category: 'funded',
    text: "J'ai reussi l'evaluation Alpha Capital Group en decembre 2024. Je suis maintenant un Certified Funded Trader. Les concepts HVC m'ont permis de passer le challenge.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/tt82x39n86koopakja3gv/Taahitini_Taero_cert.png?rlkey=00fpf97au541gwte0or2wm4sh&raw=1',
    impactScore: 10
  },
  {
    id: 'recExDYCiID8QXNx1',
    name: 'Aro Sama',
    result: 'Validation phase 2 du 2eme compte 10k',
    type: 'Screenshot resultats',
    category: 'funded',
    text: "Je viens de valider la phase 2 de mon deuxieme compte 10k. Sur ma capture d'ecran, vous voyez mon analyse GBPJPY avec les zones de liquidite parfaitement identifiees.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/hlen7ctujxqgeswqo184p/Aro_Sama_cert.JPG?rlkey=84rt7rivm9xa3p2b6rfrvy6bj&raw=1',
    impactScore: 10
  },
  {
    id: 'recMpW2jtKqsiXqyH',
    name: 'R Rai',
    result: 'Compte 100k finance + payout 7k$',
    type: 'Message Discord',
    category: 'payout',
    text: "Les formations m'ont beaucoup aide, la team super. L'esprit d'equipe m'a permis de decouvrir les propfirm et obtenir un compte finance a 100k et un payout de 7k dollars.",
    screenshot: 'https://www.dropbox.com/scl/fo/8rambyfyuwfrifbqyhrwx/ALLhEerbQr_oUoVoanbPLK0/CleanShot%202024-06-22%20at%2020.05.37%402x.png?rlkey=8ftiui84sg2moc01rtis8f44s&raw=1',
    impactScore: 9
  },
  {
    id: 'rec6wMP9up5k7uEg7',
    name: 'Aro S',
    result: 'Premiere propfirm validee',
    type: 'Message Discord',
    category: 'funded',
    text: "Les resultats parlent. J'ai valide ma premiere propfirm apres des mois d'echecs. Le partage en groupe m'aide beaucoup. Ca a depasse toutes mes attentes.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/wd6m0omei0ykqagqmtxky/Aro_S.png?rlkey=wdh6wpe8bz9adyq18px4kbviz&raw=1',
    impactScore: 8
  },
  {
    id: 'recSPOPySkQV6oKMV',
    name: 'Le V',
    result: 'Compte 50k valide',
    type: 'Message Discord',
    category: 'funded',
    text: "La communaute est au top et la strategie fonctionne parfaitement. J'ai pu enfin valider un compte a 50k. Je recommande vraiment la formation.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/5poknkffe8limudedsfnf/Le_V_message.png?rlkey=hcd55squw6xu5oyjx9oc01gb3&raw=1',
    impactScore: 9
  },
  {
    id: 'recHB4BMGKnhzn9Qm',
    name: 'Manutea',
    result: 'Compte TradeLocker finance',
    type: 'Message Discord',
    category: 'funded',
    text: "J'etais a un point ou je voulais abandonner. Heureusement j'ai revu la formation, surtout les videos sur le backtesting. Ca m'a redonne confiance. Maintenant je suis finance.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/o7c0fxfp7gimvfkcwnq7s/Manutea.PNG?rlkey=fjq6ps1rceh3v5esn1fkqgxgr&raw=1',
    impactScore: 8
  },
  {
    id: 'receRcBhpjr9CMKaX',
    name: 'Piitau H',
    result: 'Challenge 5K: 300$/500$ (60%)',
    type: 'Message Discord',
    category: 'progress',
    text: "J'ai beaucoup appris grace a vous. Je suis a 300$ sur les 500$ requis apres un trade gagnant sur USDCAD. C'est juste mon mindset que j'ameliore encore.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/s9gsn40k1khxcs38mnbop/Piitau_H_message.png?rlkey=6zdzfm31tkbwd5xyfdxcqfkow&raw=1',
    impactScore: 8
  },
  {
    id: 'rec9X5QP09Qdper1p',
    name: 'Kehauri Toa',
    result: "1+ an d'apprentissage en quelques mois",
    type: 'Message Discord',
    category: 'learning',
    text: "Depuis que je vous ai rejoint, j'ai appris tellement plus qu'en 1 an et demi sur internet. J'ai aussi pu me trouver une strategie a moi-meme.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/8fjcc8wcq3i0qwjjfde06/Kehauri_Toa.png?rlkey=fktl2oubgwifk2lrtn6o7u05f&raw=1',
    impactScore: 8
  },
  {
    id: 'reczfTJsgTDnYgEEb',
    name: 'Rainui RIMAONO',
    result: 'Remonte de -400$ a +50$',
    type: 'Message Discord',
    category: 'progress',
    text: "J'ai failli perdre mon challenge avec 400$ de perte en juin, mais je suis remonte a +50$ en juillet. J'ai des objectifs, donc je lache rien.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/9hcej678128yvv813m4oe/Rainui_RIMAONO.png?rlkey=tnc9a3a0m4ht72582nr6cf5c8&raw=1',
    impactScore: 7
  },
  {
    id: 'recidTxf0jiWq9STM',
    name: 'Hei Mana',
    result: 'Repris gout au trading en 1 mois',
    type: 'Message Discord',
    category: 'learning',
    text: "Apres 1 an en autodidacte, j'ai rejoint HVC. En 1 mois, j'ai retrouve ma motivation. La communaute ou chacun partage sa vision m'a inspire a ne jamais rien lacher.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/xgw9zo2r8elggzpxafhqi/Hei_Mana.png?rlkey=pl9mevkl5tvoirgbdpqvmgouk&raw=1',
    impactScore: 7
  },
  {
    id: 'recPcbCeI9om2MKkL',
    name: 'Adam',
    result: 'Retour apres abandon, analyses correctes',
    type: 'Message Discord',
    category: 'progress',
    text: "J'avais abandonne car pas de resultats. Le mois dernier je me suis repris et mes analyses sont de plus en plus correctes en pratiquant.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/vca7hhc8mq30ftjm31mvj/Adam.png?rlkey=jvirh5pmi68dbapj8zcaf75s5&raw=1',
    impactScore: 7
  },
  {
    id: 'recr4EqDMSdpy4D0w',
    name: 'Torea Barsinas',
    result: 'Maitrise des Zones de Recharge',
    type: 'Message Discord',
    category: 'learning',
    text: "J'ai petit a petit maitrise les concepts, notamment les Zones de Recharge. La communaute est vraiment bienveillante. Je ne regrette vraiment pas d'etre entre.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/zxbobkfblwual9ipwh4zi/Torea_Barsinas.png?rlkey=k3ajnjio9ra1wlrk6wgb4zo0u&raw=1',
    impactScore: 7
  },
  {
    id: 'recCpRi0t0iqEfos6',
    name: 'Temanu',
    result: 'Formation excellente + groupe motivant',
    type: 'Message Discord',
    category: 'learning',
    text: "Mon experience est super. La formation est excellente, il faut juste bien tout assimiler et appliquer. Le groupe m'inspire avec beaucoup de reussites.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/gmy31rja4cd7fnr11yxc3/Temanu.png?rlkey=gxu5wva73et1ob1pw2h7acyi3&raw=1',
    impactScore: 6
  },
  {
    id: 'recCjChvA28dpGSgU',
    name: 'Mano B',
    result: '4 mois de progression',
    type: 'Message Discord',
    category: 'learning',
    text: "En 4 mois, HVC m'a donne tout ce dont j'avais besoin: un mentor, une formation, une communaute. J'avais commence sur YouTube mais je stagnais.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/luvn17pvyiec5mgdwtqzi/Mano_B.png?rlkey=rolqscqxooreb55zyltdt85p5&raw=1',
    impactScore: 6
  },
  {
    id: 'recXLsfvoQKqyzkRI',
    name: 'Toerau HMN',
    result: 'Nouveau compte Alpha Capital',
    type: 'Message Discord',
    category: 'progress',
    text: "Je viens de prendre un compte chez Alpha Capital. Je sens que ca commence a payer apres des mois a suivre vos formations et vos analyses.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/23bp59u56lhtwwv8hrr1b/Toerau_HMN.png?rlkey=q4egl5o7iyinmbno94dxe2cj6&raw=1',
    impactScore: 6
  },
  {
    id: 'recmuXF1xUGdpGs5G',
    name: 'Ismael Thomas',
    result: 'Connaissances + Force psychologique',
    type: 'Message Discord',
    category: 'learning',
    text: "Mon experience m'a beaucoup apporte, en connaissance et pour me durcir psychologiquement. J'avance doucement mais surement avec mon challenge.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/5wy7vkkeb6k75fnjo9tn5/Ismael_Thomas.png?rlkey=uizuy73ohcvmxgfwqpz8s60nu&raw=1',
    impactScore: 6
  },
  {
    id: 'recsyoRVsJcnTatt9',
    name: 'Hitinui VANAA',
    result: 'Maitrise des zones de recharge',
    type: 'Message Discord',
    category: 'learning',
    text: "Niveau concept c'est bon, j'arrive a bien reperer les zones de recharge grace a vos trade-explications. Maintenant c'est psychologie et patience.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/3o6ryy2kaw4hlni1pau83/Hitinui_VANAA.png?rlkey=5rubv9uwbyopt62ztebujl2jk&raw=1',
    impactScore: 6
  },
  {
    id: 'recxxoHLbbmTA0qUi',
    name: 'Teraimoana TAURAA',
    result: 'Amelioration massive',
    type: 'Message Discord',
    category: 'progress',
    text: "Ca va mega bien le trading ! J'ai beaucoup ameliore depuis mon entree chez HVC. J'ai fait 2 essais propfirm, 2 fails au daily loss, mais je perds pas espoir !",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/beyn6scob82x0xjwh5g7o/Teraimoana_TAURAA.png?rlkey=hv866bxrouylfsosicdg2nhzt&raw=1',
    impactScore: 5
  },
  {
    id: 'recrBsAr95zJml0vX',
    name: 'Tutex Tnr',
    result: 'Formation de qualite',
    type: 'Message Discord',
    category: 'learning',
    text: "Merci pour toutes vos videos de formation, c'est nickel ! L'experience est incroyable, tout le monde est a fond, ca donne envie de se donner a fond aussi.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/z7s5gcidm7hkr5snjyxkg/Tutex_Tnr.png?rlkey=4yub6lvt2pkqwt0gic5io4g5r&raw=1',
    impactScore: 5
  },
  {
    id: 'recgK0Yu0hie0MdzN',
    name: 'Ryan Clark',
    result: 'Formation tres instructive',
    type: 'Message Discord',
    category: 'learning',
    text: "Je dirais tres instructif, j'ai appris plein de choses et j'en apprends encore davantage. Maururu encore pour l'adhesion !",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/ogzqnt4rb3suyu6r3z54w/Ryan_Clark.png?rlkey=3u9p6gncyn86id36rrblqnwk5&raw=1',
    impactScore: 5
  },
  {
    id: 'rec5q0vUpufnlr9lX',
    name: 'Ariimoana TAAROA',
    result: 'Explications claires',
    type: 'Message Discord',
    category: 'learning',
    text: "Tout est clair dans tes explications, j'ai bien appris grace a ta formation c'est sans doute. Je reviendrai bientot apres ma pause.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/3zwx6wvs1ylo8qe83qgt7/Ariimoana_TAAROA.png?rlkey=sp0f9n8ymjfkyubu9c6b0oadg&raw=1',
    impactScore: 4
  },
  {
    id: 'recOyMFLsN2Ik2esQ',
    name: 'Tahimana Williams',
    result: 'Progression solide',
    type: 'Message Discord',
    category: 'learning',
    text: "Le trading se passe tres bien. Militaire en sentinelle, pas evident de trader, mais j'envisage de prendre des permissions pour etre a fond dedans.",
    screenshot: 'https://dl.dropboxusercontent.com/scl/fi/60ehhmbu7kekmu13h9umx/Tahimana_Williams.png?rlkey=3m9b9h074zab4q9dr7sw6z4kw&raw=1',
    impactScore: 4
  }
]

const stats = [
  { value: '15+', label: 'Funded Traders', icon: Award },
  { value: '85k$+', label: 'Payouts Documentes', icon: DollarSign },
  { value: '30+', label: 'Temoignages', icon: Users },
]

const filters = [
  { key: 'all', label: 'Tous', count: testimonials.length },
  { key: 'funded', label: 'Funded', count: testimonials.filter(t => t.category === 'funded').length },
  { key: 'payout', label: 'Payouts', count: testimonials.filter(t => t.category === 'payout').length },
  { key: 'progress', label: 'En cours', count: testimonials.filter(t => t.category === 'progress').length },
  { key: 'learning', label: 'Apprentissage', count: testimonials.filter(t => t.category === 'learning').length },
]

const categoryColors: Record<string, string> = {
  payout: 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/25',
  funded: 'bg-[var(--accent)]/15 text-[var(--accent-hover)] border border-[var(--accent)]/25',
  progress: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  learning: 'bg-[var(--ivory-muted)]/10 text-[var(--ivory-muted)] border border-[var(--ivory-ghost)]',
}

const categoryLabels: Record<string, string> = {
  funded: 'Funded',
  payout: 'Payout',
  progress: 'En cours',
  learning: 'Apprentissage',
}

export default function TestimonialsPage() {
  const [filter, setFilter] = useState<string>('all')
  const [showScreenshots, setShowScreenshots] = useState(true)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(8)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null)
    }
    if (lightboxImage) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'auto'
    }
  }, [lightboxImage])

  const filteredTestimonials = filter === 'all'
    ? testimonials
    : testimonials.filter(t => t.category === filter)

  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => b.impactScore - a.impactScore)
  const visibleTestimonials = sortedTestimonials.slice(0, visibleCount)
  const hasMore = visibleCount < sortedTestimonials.length

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(8)
  }, [filter])

  return (
    <main className="relative min-h-screen" style={{ background: 'var(--black)' }}>
      <div className="noise-overlay" />

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'var(--black-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: 'var(--ivory-dim)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--ivory-dim)')}
          >
            <ArrowLeft className="w-3 h-3" />
            Retour
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-10 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 mb-8"
            style={{
              background: 'var(--accent-muted)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
            }}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--accent-hover)' }}>
              Resultats reels
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium mb-6 leading-[1.1]" style={{ color: 'var(--ivory)' }}>
            Ce qu'ils en{' '}
            <em className="text-accent-gradient">disent</em>
          </h1>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--ivory-muted)' }}>
            <span style={{ color: 'var(--ivory)' }} className="font-medium">{testimonials.length} temoignages</span> de traders
            qui ont rejoint High Value Capital et obtenu des resultats concrets.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-3 md:gap-5">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="card text-center p-4 md:p-6"
              >
                <stat.icon className="w-5 md:w-6 h-5 md:h-6 mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                <div className="font-display text-2xl md:text-3xl font-medium text-accent-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm uppercase tracking-wider" style={{ color: 'var(--ivory-dim)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="accent-line max-w-5xl mx-auto my-6" />

      {/* Filters — sticky */}
      <section
        className="py-4 px-6 sticky top-[28px] z-40 border-b"
        style={{
          background: 'rgba(10, 10, 10, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'var(--black-border)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                style={
                  filter === f.key
                    ? { background: 'var(--accent)', color: '#fff' }
                    : { background: 'var(--black-card)', border: '1px solid var(--black-border)', color: 'var(--ivory-muted)' }
                }
              >
                {f.label}
                <span className="text-xs" style={{ opacity: 0.6 }}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Toggle Screenshots */}
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setShowScreenshots(!showScreenshots)}
              className="text-sm flex items-center gap-2 transition-colors"
              style={{ color: 'var(--ivory-dim)' }}
            >
              {showScreenshots ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showScreenshots ? 'Masquer les screenshots' : 'Afficher les screenshots'}
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Grid — Masonry 2-col */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="columns-1 md:columns-2 gap-5 space-y-5">
            {visibleTestimonials.map((t) => (
              <div
                key={t.id}
                className="card break-inside-avoid overflow-hidden"
                style={
                  t.impactScore >= 9
                    ? { borderColor: 'var(--accent)', boxShadow: '0 0 24px rgba(37, 99, 235, 0.08)' }
                    : undefined
                }
              >
                {/* Screenshot */}
                {showScreenshots && t.screenshot && (
                  <div
                    className="relative w-full overflow-hidden cursor-pointer group"
                    style={{ background: 'var(--black-rich)' }}
                    onClick={() => setLightboxImage(t.screenshot)}
                  >
                    <img
                      src={t.screenshot}
                      alt={`Temoignage de ${t.name}`}
                      className="w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement!.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium" style={{ color: 'var(--ivory)' }}>
                        Agrandir
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-display text-lg font-medium" style={{ color: 'var(--ivory)' }}>
                        {t.name}
                      </h3>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--accent-hover)' }}>
                        {t.result}
                      </p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap ${categoryColors[t.category]}`}>
                      {categoryLabels[t.category]}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ivory-muted)' }}>
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--black-border)' }}>
                    <span className="text-xs" style={{ color: 'var(--ivory-ghost)' }}>{t.type}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: i < Math.round(t.impactScore / 2)
                              ? 'var(--accent)'
                              : 'var(--black-hover)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount(prev => prev + 8)}
                className="btn-secondary"
              >
                Voir plus de temoignages ({sortedTestimonials.length - visibleCount} restants)
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="accent-line max-w-5xl mx-auto" />

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-medium mb-6" style={{ color: 'var(--ivory)' }}>
            Pret a ecrire{' '}
            <em className="text-accent-gradient">ton temoignage</em> ?
          </h2>
          <p className="text-lg mb-10" style={{ color: 'var(--ivory-muted)' }}>
            Rejoins High Value Capital et deviens le prochain Funded Trader.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://community.highvaluecapital.club/pricing"
              className="btn-primary text-lg group"
            >
              <span className="flex items-center gap-2">
                Rejoindre HVC - 49EUR/mois
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-5 justify-center items-center text-sm" style={{ color: 'var(--ivory-dim)' }}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span>Communaute active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6" style={{ borderTop: '1px solid var(--black-border)' }}>
        <div className="max-w-7xl mx-auto text-center text-sm" style={{ color: 'var(--ivory-ghost)' }}>
          <p>2026 High Value Capital. Tous droits reserves.</p>
        </div>
      </footer>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10 cursor-pointer"
          style={{ background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(8px)' }}
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full transition-colors z-10"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--ivory)' }}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxImage}
            alt="Screenshot en grand"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  )
}
