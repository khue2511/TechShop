/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      inset: {
        25: '6.25rem',
        26: '6.5rem',
      },
    },
  },
  plugins: [],
};
