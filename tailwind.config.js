/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        folha: { DEFAULT: '#1E5A3C', escura: '#143D29', clara: '#E4EEDF' },
        milho: '#F2B53A',
        tinta: '#1A231E',
        papel: '#F5F7F2',
        tomate: '#B83A24',
        terra: '#8A5A33',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Atkinson Hyperlegible"', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
