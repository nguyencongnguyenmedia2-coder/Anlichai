/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        oriental: {
          red: {
            50: '#fff1f2',
            100: '#ffe4e6',
            500: '#e11d48',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
            950: '#450a0a',
          },
          gold: {
            50: '#fffbeb',
            100: '#fef3c7',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            900: '#78350f',
          },
          jade: {
            50: '#ecfdf5',
            500: '#10b981',
            700: '#047857',
            900: '#064e3b',
          },
          dark: {
            bg: '#140c0c',
            card: '#221515',
            border: '#3d2424',
          }
        }
      },
      fontFamily: {
        serif: ['"Merriweather"', '"Noto Serif Display"', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'oriental': '0 10px 30px -10px rgba(153, 27, 27, 0.25)',
        'gold-glow': '0 0 15px rgba(245, 158, 11, 0.4)',
      }
    },
  },
  plugins: [],
}
