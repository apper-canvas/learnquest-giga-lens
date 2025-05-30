/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B9D',
          light: '#FFB8D4',
          dark: '#E5527A'
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          light: '#8EEAE5',
          dark: '#3BB5AE'
        },
        accent: '#FFD93D',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Fredoka', 'Inter', 'ui-sans-serif', 'system-ui'],
        fun: ['Fredoka', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'game': '0 8px 32px rgba(255, 107, 157, 0.3)',
        'achievement': '0 4px 20px rgba(255, 217, 61, 0.4)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        'blob': '60% 40% 30% 70% / 60% 30% 70% 40%'
      },
      animation: {
        'bounce-soft': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
'sparkle': 'sparkle 1.5s ease-in-out infinite',
'spin-slow': 'spin 3s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'flip': 'flip 0.6s ease-in-out'
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' }
'50%': { opacity: '1', transform: 'scale(1.2)' }
        },
'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
          '50%': { transform: 'translateY(-5px)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 107, 157, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 107, 157, 0.8), 0 0 30px rgba(255, 107, 157, 0.6)' }
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '50%': { transform: 'rotateY(-90deg)' },
          '100%': { transform: 'rotateY(0)' }
        }
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}