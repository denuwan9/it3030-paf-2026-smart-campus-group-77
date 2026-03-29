/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lumina: {
          'bg-base': '#FFFFFF',
          'bg-surface': '#F8FAFC',
          'bg-overlay': '#F1F5F9',
          'text-header': '#1E293B',
          'text-body': '#475569',
          'text-muted': '#64748B',
          'text-inverse': '#FFFFFF',
          'brand-primary': '#6366F1',
          'brand-primaryHover': 'rgba(99, 102, 241, 0.1)',
          'brand-secondary': '#0D9488',
          'brand-secondaryHover': 'rgba(13, 148, 136, 0.1)',
          'status-success': '#10B981',
          'status-warning': '#F59E0B',
          'status-error': '#F43F5E',
          'status-info': '#3B82F6',
          'accent-orange': '#FF7A30',
          'bg-accent': '#F0F4F2',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      boxShadow: {
        'lumina-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'lumina-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lumina-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
