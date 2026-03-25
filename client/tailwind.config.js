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
          200: '#d1dbff',
          300: '#a3b5ff',
          400: '#6b7fff',
          500: '#4650ff',
          600: '#2d2dff',
          700: '#2222ff',
          800: '#1c1cff',
          900: '#1a18d1',
          950: '#0000a3',
        },
      },
    },
  },
  plugins: [],
}
