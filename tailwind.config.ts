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
        // Void blacks
        'void': '#08090d',
        'obsidian': '#0a0b10',
        'charcoal': '#111318',
        'slate': '#1a1c24',
        'smoke': '#252730',

        // Gradient Moderne (blue → indigo → violet)
        'champagne': '#3b82f6',
        'gold': '#6366f1',
        'gold-light': '#8b5cf6',
        'gold-pale': '#a78bfa',

        // Accent
        'cyan': '#06b6d4',

        // Lights
        'ivory': '#f0f0f5',
        'pearl': '#e0e0e8',
        'mist': '#8888a0',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Outfit', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'float': 'float 20s ease-in-out infinite',
        'aurora': 'aurora 25s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'shine': 'shine 8s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(30px, -40px) scale(1.05)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '75%': { transform: 'translate(40px, 30px) scale(1.02)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(2%, 3%) rotate(1deg)' },
          '50%': { transform: 'translate(-1%, 2%) rotate(-1deg)' },
          '75%': { transform: 'translate(3%, -2%) rotate(0.5deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '0.6', transform: 'scale(1)' },
        },
        shine: {
          to: { backgroundPosition: '200% center' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
        'gradient-gold-light': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.15), 0 0 40px rgba(99, 102, 241, 0.1)',
        'glow-intense': '0 0 30px rgba(99, 102, 241, 0.25), 0 0 60px rgba(99, 102, 241, 0.15)',
        'card': '0 20px 40px rgba(0, 0, 0, 0.3)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

export default config
