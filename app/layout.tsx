import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'High Value Capital | Formation Trading Forex',
  description: 'Rejoins une communauté de traders francophones qui passent leurs challenges propfirm et génèrent des payouts réels. 15+ Funded Traders, 85k$+ de payouts documentés.',
  keywords: 'trading, forex, formation, propfirm, funded trader, ARD, ICT, SMC, liquidité',
  authors: [{ name: 'Jordy Banks' }],
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'High Value Capital | Formation Trading Forex',
    description: 'Découvre la méthode qui a permis à 15+ membres de devenir Funded Traders.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'High Value Capital',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'High Value Capital | Formation Trading Forex',
    description: 'Découvre la méthode qui a permis à 15+ membres de devenir Funded Traders.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}
