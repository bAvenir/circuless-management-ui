/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,vue,ts}'],
  theme: {
    extend: {
      colors: {
        realm: {
          primary: {
            50: '#f2fbf3',
            100: '#f2fbf3',
            200: '#e1f7e3',
            300: '#c4eec8',
            400: '#96df9d',
            500: '#5bc566',
            600: '#2c8d37',
            700: '#266f2e',
            800: '#225929',
            900: '#1e4924',
            950: '#0b280f',
          },
          secondary: {
            50: '#f3f6fb',
            100: '#e3eaf6',
            200: '#cedcef',
            300: '#adc4e3',
            400: '#85a6d5',
            500: '#688ac9',
            600: '#5571bb',
            700: '#4a60ab',
            800: '#41508c',
            900: '#384570',
            950: '#2b324f',
          },
          text: {
            50: '#f7f7f7',
            100: '#e3e3e3',
            200: '#c8c8c8',
            300: '#a4a4a4',
            400: '#818181',
            500: '#666666',
            600: '#515151',
            700: '#484848',
            800: '#383838',
            900: '#313131',
          },
          lightGreen: '#f2fcf4',
        },
        circuless: {
          primary: '#4e5f3c',
          lightGreen: '#cbd9bc',
        },
        text: '#333333',
        danger: '#EA5455',
        whitesmoke: '#f3f3f3',
      },
      fontSize: {
        regular: '14px',
      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
}
