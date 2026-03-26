/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#08080f',
        surface: '#0f0f1a',
        'border-subtle': 'rgba(255,255,255,0.06)',
        accent: '#6366f1',
        muted: '#64748b',
      },
    },
  },
  plugins: [],
}

