/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Brand ramp ─────────────────────────────────────────────────────
        sprout: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // ── Economy roles ──────────────────────────────────────────────────
        coin: {
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        xp: {
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        streak: {
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        // ── Surfaces ───────────────────────────────────────────────────────
        cream: {
          50:  '#fdfcf8',
          100: '#faf8f2',
          200: '#f5f0e8',
          300: '#ece4d4',
        },
        surface: {
          canvas: '#faf8f2',
          card: '#fffdf9',
          elevated: '#ffffff',
        },
        // ── Text roles ─────────────────────────────────────────────────────
        ink: {
          DEFAULT: '#1f2a22',
          secondary: '#5c6b60',
          muted: '#96a39a',
        },
        // ── Borders ────────────────────────────────────────────────────────
        line: {
          subtle: '#eee9de',
          strong: '#ddd5c4',
        },
        // ── Difficulty roles (tuned toward the Sprout palette) ─────────────
        easy: {
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        hard: {
          100: '#ffe4e6',
          600: '#e11d48',
          700: '#be123c',
        },
        // ── Feedback roles ─────────────────────────────────────────────────
        danger: {
          50: '#fff1f2',
          200: '#fecdd3',
          500: '#f43f5e',
          600: '#e11d48',
        },
        warn: {
          50: '#fffbeb',
          200: '#fde68a',
          700: '#b45309',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography roles
        display: ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        title:   ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '800' }],
        heading: ['1.0625rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '700' }],
        body:    ['0.9375rem', { lineHeight: '1.5', fontWeight: '400' }],
        label:   ['0.8125rem', { lineHeight: '1.4', fontWeight: '600' }],
        caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        stat:    ['1.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 16px 0 rgba(31,42,34,0.06)',
        card: '0 1px 8px 0 rgba(31,42,34,0.07)',
        lift: '0 6px 24px -4px rgba(31,42,34,0.14)',
      },
    },
  },
  plugins: [],
}
