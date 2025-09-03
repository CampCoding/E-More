/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
          "emore-red" :"#ff0303",
          "emore-blue" :"#3eafe8",
      }
    }
  },
  plugins: [require('postcss-nesting')],
  // Since you're using Material Tailwind, we'll make sure it works alongside it
  corePlugins: {
    preflight: false
  }
};
