/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        crimson: '#DC143C',
        darkGray: '#393e46',
        brand: {
          50: '#eef4ff',
          100: '#dfe9ff',
          200: '#c1d3ff',
          300: '#96b3fe',
          400: '#6488fb',
          500: '#3f61f5',
          600: '#2c40e8',
          700: '#2530c7',
          800: '#1f2a9e',
          900: '#151b52',
          950: '#0b0e2e',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2c40e8 0%, #6488fb 50%, #3fd0f5 100%)',
        'brand-dark': 'linear-gradient(135deg, #0b0e2e 0%, #151b52 60%, #1f2a9e 100%)',
      },
    },
  },
  plugins: [],
}

