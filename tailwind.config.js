/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,vue,ts}'],
  theme: {
    extend: {
      colors: {
        circulessPrimary: '#4e5f3c',
        circulessLightGreen: '#cbd9bc',
        earthLighter: '#AF623C',
        text: '#333333',
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
