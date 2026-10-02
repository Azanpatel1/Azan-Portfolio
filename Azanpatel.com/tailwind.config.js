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
          DEFAULT: '#fafaf9',
          surface: '#f4f4f3',
          raised: '#ececea',
          line: '#dcdcda',
          edge: '#b8b8b4',
        },
        text: {
          DEFAULT: '#111110',
          muted: '#4b4b53',
          subtle: '#6b6b74',
        },
        accent: {
          DEFAULT: '#b45309',
          hover: '#d97706',
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
