/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./client/dist/*.html', 'client/src/**/*.{js,jsx}', 'client/src/*.{js,jsx}', 'client/src/**/**/*.{js,jsx}'],
  theme: {
    extend: { display: ['group-hover', 'responsive', 'hover'], },

  },
  plugins: [],
}

