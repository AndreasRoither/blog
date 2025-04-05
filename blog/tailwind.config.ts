/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'animate-disapparate'
  ],
  theme: {
    extend: {
      animation: {
        disapparate: 'disapparate 1s ease-out forwards',
      },
      keyframes: {
        disapparate: {
          '0%': { opacity: '1', transform: 'scale(1) rotate(0deg)', filter: 'blur(0)' },
          '70%': { opacity: '0.5', transform: 'scale(1.05) rotate(10deg)', filter: 'blur(1px)' },
          '95%': { opacity: '0.1', transform: 'scale(0.3) rotate(-25deg)', filter: 'blur(4px)' },
          '100%': { opacity: '0', transform: 'scale(0) rotate(-35deg)', filter: 'blur(5px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}