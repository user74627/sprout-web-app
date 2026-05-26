/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
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
        coin: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        cream: {
          50:  '#fdfcf8',
          100: '#faf8f2',
          200: '#f5f0e8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 16px 0 rgba(0,0,0,0.06)',
        'card': '0 1px 8px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
