/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a2463', // deep blue for academic feel
          light: '#3e92cc', // lighter blue
          dark: '#061539', // darker blue
        },
        secondary: {
          DEFAULT: '#3e92cc', // bright blue for accents
        },
        accent: {
          DEFAULT: '#00b4d8', // cyan for modern feel
        },
        dark: {
          DEFAULT: '#121212',
          light: '#1e1e1e',
          lighter: '#2d2d2d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, #3e92cc10 1px, transparent 1px), linear-gradient(to bottom, #3e92cc10 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} 