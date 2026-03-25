/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#faf7f5', // warm cream
          dark: '#f0e9e4',
        },
        card: '#ffffff',
        navy: {
          DEFAULT: '#1a1a2e', // deep navy text
          light: '#2a2a4a',
        },
        slate: '#64748b', // secondary text
        accent: {
          pink: '#d4366e', // deep rose
          lavender: '#8b5cf6', // soft lavender
          coral: '#f97066', // coral
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Comic Neue"', 'cursive'],
      },
      boxShadow: {
        'warm': '0 4px 20px rgba(212, 54, 110, 0.08)',
        'warm-hover': '0 10px 30px rgba(212, 54, 110, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'dot-pattern': 'radial-gradient(circle, #d4366e 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot': '24px 24px',
      }
    },
  },
  plugins: [],
}