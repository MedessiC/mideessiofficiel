/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Active le mode sombre basé sur une classe
  theme: {
    extend: {
      colors: {
        // Couleurs principales MIDEESSI
        midnight: '#191970',
        navy: '#1E3A5F',
        steel: '#2C5F8D',
        yellow: '#FFD700', // accent jaune vif MIDEESSI

        // Palette corporate
        corporate: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#102A43',
        },
      },
      fontFamily: {
        // Typographies MIDEESSI
        display: ['Montserrat', 'system-ui', 'sans-serif'], // Titres
        sans: ['Open Sans', 'system-ui', 'sans-serif'],     // Paragraphes
      },
      // Tu peux ajouter ici des extensions supplémentaires comme spacing, borderRadius, etc.
    },
  },
  plugins: [],
};
