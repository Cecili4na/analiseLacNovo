/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8BA989',
        terra: '#9E5D45',    // Marrom avermelhado
        sage: '#8BA989',     // Verde sage
        sand: '#D4C5A9',     // Tom areia
        cream: '#F5F2EB'     // Fundo creme
      },
    },
  },
  plugins: [],
} 