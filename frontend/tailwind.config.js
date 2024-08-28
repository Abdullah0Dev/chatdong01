/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: '#fef3ce',
        white: '#ffffff',
        primary: '#0F0704',
        secondary: '#f7f7f7',
        black: {
        100: '#010411',
        200: '#8d8d8f',
        },
        blue: '#E4F2FD',
        pink: "#D0C3F0",
        purple: '#eecbd1',
      },
    },
  },
  plugins: [],
}

