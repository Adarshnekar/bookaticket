/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bmtc: {
          red: '#C8102E',
          'red-dark': '#A30D25',
          'red-light': '#FDF2F4',
          'red-subtle': '#FFF5F6',
          gold: '#FFD700',
        },
        surface: {
          bg: '#F9F9FF',
          secondary: '#F0F3FF',
          card: '#FFFFFF',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
        },
        volvo: {
          DEFAULT: '#2563EB',
          badge: '#3B82F6',
          bg: '#EFF6FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px -2px rgba(0, 0, 0, 0.06), 0 4px 16px -2px rgba(200, 16, 46, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(200, 16, 46, 0.08)',
        'sticky-bar': '0 -4px 20px -2px rgba(0, 0, 0, 0.08)',
        'ticket': '0 8px 30px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}

