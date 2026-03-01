import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#0a0a0a',
          rich: '#111111',
          card: '#161616',
          elevated: '#1a1a1a',
          border: '#222222',
          hover: '#2a2a2a',
        },
        ivory: {
          DEFAULT: '#F5F0EB',
          muted: '#B8B0A6',
          dim: '#7A7570',
          ghost: '#4A4744',
        },
        accent: {
          DEFAULT: '#2563EB',
          hover: '#3B82F6',
          muted: 'rgba(37, 99, 235, 0.15)',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', '"Times New Roman"', 'serif'],
        body: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 7vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 3.75rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      spacing: {
        'section': 'clamp(5rem, 12vh, 8rem)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
