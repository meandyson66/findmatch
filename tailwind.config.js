/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        momo: '#3DEE9F',
        'momo-dark': '#2DD4BF',
        'momo-bg': '#14121F',
        'momo-card': '#252238',
        'momo-text': '#F1F5F9',
        'momo-sub': '#94A3B8',
        'momo-line': 'rgba(255,255,255,0.14)',
        obsidian: '#0F0D15',
        neon: '#C084FC',
        mint: '#2DD4BF',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      boxShadow: {
        phone: '0 32px 64px rgba(15,23,42,0.14)',
        glass: '0 8px 32px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.75)',
        'glass-sm': '0 4px 16px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.65)',
      },
      backdropBlur: {
        ios: '28px',
      },
    },
  },
  plugins: [],
}