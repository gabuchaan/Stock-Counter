/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'main-color': '#FF8059',
        'main-dark-color': '#F2683D',
        'main-most-dark-color': '#A63A19',
        'sub-color': '#3D61F2',
        'sub-color-dark': '#244CF2',
        'sub-color-most-dark': '#1935A6',
        'accent-color': '#A3F255',
        'soft-white': '#F4F5F7',
        'soft-black': '#333333'
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
  darkMode: "class"
}