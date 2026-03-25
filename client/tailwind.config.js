/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#adc2ff',
          400: '#85a3ff',
          500: '#5c85ff',
          600: '#3366ff',
          700: '#2952cc',
          800: '#1f3d99',
          900: '#142966',
        },
      },
    },
  },
  plugins: [],
}
