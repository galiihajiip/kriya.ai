/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#403F2E',
        accent: '#F8C471',
        background: '#FDFBF5',
        textColor: '#2C2C2C',
        textLight: '#6B6B6B',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}
