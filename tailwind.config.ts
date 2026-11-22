import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        hairline: 'var(--border-hairline)',
        subtle: 'var(--border-subtle)',
        affinity: {
          brand: 'var(--accent-brand)',
          designer: 'var(--accent-designer)',
          photo: 'var(--accent-photo)',
          publisher: 'var(--accent-publisher)',
          scripting: 'var(--accent-scripting)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        kanit: ['Kanit', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        card: 'var(--shadow-card)',
        'glow-designer': 'var(--shadow-glow-designer)',
        'glow-photo': 'var(--shadow-glow-photo)',
        'glow-publisher': 'var(--shadow-glow-publisher)',
        'glow-brand': 'var(--shadow-glow-brand)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap, 1rem)))' },
        },
        'shiny-text': {
          '0%, 90%, 100%': { 'background-position': 'calc(-100% - var(--shiny-width, 100px)) 0' },
          '30%, 60%': { 'background-position': 'calc(100% + var(--shiny-width, 100px)) 0' },
        },
        beam: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        'beam-reverse': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '1000' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration, 40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
        'shiny-text': 'shiny-text 8s infinite',
        beam: 'beam 3s linear infinite',
        'beam-reverse': 'beam-reverse 3s linear infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
