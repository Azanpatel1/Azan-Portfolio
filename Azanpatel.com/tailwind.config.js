/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Palette lives in index.css as RGB triplets so a theme can swap it.
      colors: {
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          surface: 'rgb(var(--ink-surface) / <alpha-value>)',
          raised: 'rgb(var(--ink-raised) / <alpha-value>)',
          line: 'rgb(var(--ink-line) / <alpha-value>)',
          edge: 'rgb(var(--ink-edge) / <alpha-value>)',
        },
        text: {
          DEFAULT: 'rgb(var(--text) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
          subtle: 'rgb(var(--text-subtle) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
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
