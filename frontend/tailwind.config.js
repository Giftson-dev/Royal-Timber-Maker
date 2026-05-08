/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rtm: {
          coral: "#E06D53",
          mustard: "#EAB308",
          teal: "#2D7A82",
          light: {
            bg: "#FCFBF8",
            surface: "#F4F1EA",
            text: "#2D2B2A"
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
