/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#050505',
          surface: '#0d0d0d',
          raised: '#141414',
          line: '#262626',
          edge: '#3f3f3f',
        },
        text: {
          DEFAULT: '#fafafa',
          muted: '#a1a1aa',
          subtle: '#71717a',
        },
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
