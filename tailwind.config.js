/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: '768px',
        md: '960px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      colors: {
        primary: {
          DEFAULT: '#6A3DE8',
          light: '#8A65F7',
          dark: '#4A1DB8',
        },
        secondary: {
          DEFAULT: '#FFD700',
          light: '#FFEB80',
          dark: '#B89B00',
        },
        accent: {
          DEFAULT: '#00D1FF',
          light: '#80E8FF',
          dark: '#0097B8',
        },
        background: {
          dark: '#121212',
          DEFAULT: '#1E1E1E',
          light: '#2D2D2D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Cinzel', 'serif'],
        fantasy: ['MedievalSharp', 'cursive'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/src/assets/images/hero-bg.jpg')",
      },
    },
  },
  plugins: [],
}

