/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme base - Student Diary palette
        dark: {
          900: '#060c18',
          800: '#0d1422',
          750: '#0f1929',
          700: '#141c2e',
          650: '#172035',
          600: '#1a2540',
          500: '#1e2d4a',
          400: '#243452',
          300: '#2a3d60',
        },
        // Blue accent
        blue: {
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          glow: 'rgba(59,130,246,0.3)',
        },
        // Card / glass
        card: {
          DEFAULT: 'rgba(20, 28, 46, 0.85)',
          border: 'rgba(59,130,246,0.15)',
          hover: 'rgba(20,28,46,0.95)',
        },
        // Text colors
        muted: '#4a5568',
        subtle: '#64748b',
        dim: '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(-8px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        glow:    { from: { boxShadow: '0 0 10px rgba(59,130,246,0.2)' }, to: { boxShadow: '0 0 24px rgba(59,130,246,0.55)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      boxShadow: {
        'blue-sm':  '0 0 12px rgba(59,130,246,0.2)',
        'blue-md':  '0 0 24px rgba(59,130,246,0.35)',
        'blue-lg':  '0 0 40px rgba(59,130,246,0.5)',
        'card':     '0 4px 24px rgba(0,0,0,0.4)',
        'card-lg':  '0 8px 40px rgba(0,0,0,0.6)',
        'inner-blue': 'inset 0 1px 0 rgba(59,130,246,0.1)',
      },
      backgroundImage: {
        'tech-grid': "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
        'hero-glow': "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 70%)",
      },
      backgroundSize: {
        'tech-grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
