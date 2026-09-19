/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#07090e',
          800: '#0d111a',
          700: '#161c2b',
          600: '#21293d',
        },
        brand: {
          purple: '#8b5cf6',
          indigo: '#6366f1',
          cyan: '#06b6d4',
          emerald: '#10b981',
          pink: '#ec4899',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
