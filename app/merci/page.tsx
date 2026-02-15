'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, MessageCircle, ArrowRight, Sparkles, Mail, BookOpen, Users } from 'lucide-react'

// Particules simplifiées
function SimpleParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
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

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
      <SimpleBackground />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <Image
            src="/logo-hvc-white.png"
            alt="High Value Capital"
            width={180}
            height={65}
            className="mx-auto"
          />
        </div>

        {/* Card principale */}
        <div className="card-highlight p-8 md:p-12 rounded-2xl text-center glow-gold-intense">
          {/* Icon success avec animation */}
          <div className="animate-scale-in opacity-0 inline-flex items-center justify-center w-20 h-20 bg-gradient-gold rounded-full mb-8 glow-gold">
            <CheckCircle className="w-12 h-12 text-void" />
          </div>

          {/* Titre */}
          <h1 className="animate-fade-up delay-100 opacity-0 font-display text-3xl md:text-4xl font-medium mb-4">
            Bienvenue dans la{' '}
            <span className="italic text-gradient-gold">High Value Family</span> !
          </h1>

          {/* Message */}
          <p className="animate-fade-up delay-200 opacity-0 text-pearl text-lg mb-10">
            Ton paiement a été confirmé avec succès. Tu as maintenant accès à la{' '}
            <span className="text-champagne font-medium">Formation Trading Premium</span>.
          </p>

          {/* Étapes suivantes */}
          <div className="animate-fade-up delay-300 opacity-0 bg-glass border border-champagne/10 rounded-xl p-6 md:p-8 mb-10 text-left">
            <h2 className="font-display text-xl font-medium mb-6 flex items-center gap-2 text-ivory">
              <Sparkles className="w-5 h-5 text-champagne" />
              Prochaines étapes
            </h2>

            <div className="space-y-6">
              {/* Étape 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-champagne/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-champagne" />
                </div>
                <div>
                  <h3 className="font-medium text-ivory mb-1">Email de confirmation en cours</h3>
                  <p className="text-mist text-sm leading-relaxed">
                    Vérifie ta boîte mail (et tes spams) pour ton reçu Stripe.
                  </p>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-champagne/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-champagne" />
                </div>
                <div>
                  <h3 className="font-medium text-ivory mb-1">Rejoins le Discord HVC</h3>
                  <p className="text-mist text-sm leading-relaxed">
                    Accède à tous les modules, lives hebdomadaires et groupe privé Premium.
                  </p>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-champagne/10 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-champagne" />
                </div>
                <div>
                  <h3 className="font-medium text-ivory mb-1">Démarre ta formation</h3>
                  <p className="text-mist text-sm leading-relaxed">
                    Commence par le Module 1 : Fondations ARD et progresse à ton rythme.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA principal */}
          <div className="animate-fade-up delay-400 opacity-0">
            <a
              href="https://discord.gg/nwc8kbxSVt"
              className="btn-primary text-lg group inline-flex glow-gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Rejoindre le Discord
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </a>

            {/* Message support */}
            <p className="text-mist text-sm mt-6">
              Un problème ? Contacte-nous directement sur{' '}
              <a
                href="https://discord.gg/nwc8kbxSVt"
                className="text-champagne hover:text-gold-light transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>{' '}
              ou par email.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="text-mist hover:text-champagne transition-colors text-sm"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
