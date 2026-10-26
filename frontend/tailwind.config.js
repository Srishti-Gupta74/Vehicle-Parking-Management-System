/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        cosmic: {
          950: '#06030e',
          900: '#0c071d',
          850: '#110a28',
          800: '#170e36',
          750: '#1f1347',
          700: '#281a5c',
        },
        aurora: {
          cyan: '#06b6d4',
          teal: '#14b8a6',
          emerald: '#10b981',
          rose: '#f43f5e',
          fuchsia: '#d946ef',
          violet: '#8b5cf6',
          amber: '#f59e0b',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(168, 85, 247, 0.25)',
        'glow-md': '0 0 25px rgba(168, 85, 247, 0.35)',
        'glow-lg': '0 0 40px rgba(168, 85, 247, 0.45)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.35)',
        'glow-rose': '0 0 25px rgba(244, 63, 94, 0.35)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora-drift': 'drift 12s ease-in-out infinite alternate',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.08)' },
          '100%': { transform: 'translate(-20px, 20px) scale(0.96)' },
        }
      }
    },
  },
  plugins: [],
}
