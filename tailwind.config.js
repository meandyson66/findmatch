/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        momo: '#3EB575',
        'momo-dark': '#2DA065',
        'momo-bg': '#F3F3F5',
        'momo-card': '#FFFFFF',
        'momo-text': '#1A1A1A',
        'momo-sub': '#8E8E93',
        'momo-line': '#E8E8ED',
        obsidian: '#0F0D15',
        neon: '#A855F7',
        mint: '#34D399',
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