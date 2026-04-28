/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  // Enable RTL variant so we can use rtl: prefix when needed
  // Main RTL handling is done via dir attribute + logical properties
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'Cairo', 'sans-serif'],
        body: ['DM Sans', 'Cairo', 'sans-serif'],
        mono: ['JetBrains Mono', 'Cairo', 'monospace'],
        arabic: ['Cairo', 'Noto Kufi Arabic', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#00E5FF',
          dim: '#00B8CC',
          glow: 'rgba(0,229,255,0.15)',
        },
        surface: {
          dark: '#0A0E1A',
          card: '#111827',
          border: '#1E2A3A',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
