# HVC Landing Page

Page de vente High Value Capital - Formation Trading Forex

## Stack

- Next.js 15
- React 18
- Tailwind CSS
- Lucide Icons

## Developpement

```bash
npm install
cp .env.example .env.local
# Ajouter les cles Stripe dans .env.local
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

### Variables d'environnement

Copier `.env.example` vers `.env.local` et remplir:

- `STRIPE_SECRET_KEY`: Cle secrete Stripe (depuis dashboard Stripe)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Cle publique Stripe

**Important**: Ne jamais commiter `.env.local` (deja dans `.gitignore`)

## Deploiement Vercel

### Option 1: Via GitHub (recommande)

1. Push ce dossier vers un repo GitHub
2. Connecte le repo sur [vercel.com](https://vercel.com)
3. Vercel detecte automatiquement Next.js
4. Deploy

### Option 2: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## Structure

```
landing-page/
├── app/
│   ├── globals.css    # Styles + couleurs HVC
│   ├── layout.tsx     # Layout + SEO
│   └── page.tsx       # Landing page complete
├── tailwind.config.ts # Config Tailwind + couleurs custom
├── next.config.js
└── package.json
```

## Branding HVC

| Element | Valeur |
|---------|--------|
| Couleur primaire | `#1a1a2e` (bleu fonce) |
| Couleur accent | `#d4af37` (or) |

## URLs

- Formation gratuite: `https://www.community.highvaluecapital.club/invitation?code=E573F8#landing-page`
- Formation premium: `/checkout` (page custom avec Stripe Checkout)
- Page merci: `/merci` (apres paiement Stripe)

## Deploiement Netlify

### Configuration Variables d'Environnement

Dans Netlify Dashboard > Site settings > Environment variables:

```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```
