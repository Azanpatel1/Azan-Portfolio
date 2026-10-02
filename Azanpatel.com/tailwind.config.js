/** @type {import('tailwindcss').Config} */

// Graphite text is drawn at partial alpha so the paper grain shows through every
// stroke (that is what makes it read as pencil rather than ink). The base colour
// and each token's alpha live in CSS custom properties (src/index.css :root) so
// `prefers-contrast: more` can raise them in one place, and every slash-opacity
// variant (text-text-muted/90) composes with the token multiplicatively.
const graphite = (alphaVar) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `rgb(var(--graphite) / var(${alphaVar}))`
    : `rgb(var(--graphite) / calc(var(${alphaVar}) * ${opacityValue}))`;
const accent = ({ opacityValue }) =>
  opacityValue === undefined ? `rgb(var(--accent))` : `rgb(var(--accent) / ${opacityValue})`;

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // paper
        ink: {
          DEFAULT: '#f3eee3',
          // translucent graphite washes: a card reads as a slightly darker patch of the
          // same sheet and the paper texture stays visible through it
          surface: 'rgb(42 42 48 / 0.035)',
          raised: 'rgb(42 42 48 / 0.07)',
          line: '#cdc5b4',
          edge: '#a89f8c',
        },
        // solid references for the same paper tones (e.g. a flat fill is required)
        paper: {
          DEFAULT: '#f3eee3',
          surface: '#ece6d8',
          raised: '#e4ddcd',
        },
        // alphas: .86 / .76 / .70 -> ≥ 7.7 / 5.7 / 4.8 : 1 on the card wash (WCAG AA)
        text: {
          DEFAULT: graphite('--ink-a'),
          muted: graphite('--ink-a-muted'),
          subtle: graphite('--ink-a-subtle'),
        },
        // #a64b07: 4.7:1 on the card wash at body size (was #b45309, 4.1:1)
        accent: {
          DEFAULT: accent,
          hover: '#d97706',
        },
      },
      fontFamily: {
        sans: ['"Architects Daughter"', 'cursive'],
        mono: ['"Architects Daughter"', 'cursive'],
        // the stroke-animated hero lines: the only face with stroke-order data
        hand: ['"Shadows Into Light"', 'cursive'],
      },
    },
  },
  plugins: [],
}
