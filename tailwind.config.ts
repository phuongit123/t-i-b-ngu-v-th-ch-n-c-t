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
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
