/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,vue,ts}'],
  theme: {
    extend: {
      colors: {
        circulessPrimary: '#283535',
        circulessFontPrimary: '#DEE4D6',
        earthLighter: '#AF623C',
        lightGrey: '#6C757D',
        danger: '#EA5455',
      },
      fontSize: {
        regular: '14px',
      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
}
