/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'istcolor-green': {
          dark: '#a9bb1e',
          light: '#c4d733',
        },
        'istcolor-grey': {
          dark: '#696969',
          medium: '#adadad',
          light: '#8f8f8f',
          'extra-light': '#dadada',
        },
        'istcolor-black': '#1d1d1d',
        'istcolor-white': '#f0f0f0',
        'istcolor-blue': '#458ca5',
      },
    },
    fontFamily: {
      'montserrat-regular': ['Montserrat-Regular', 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],

      'montserrat-black': ['Montserrat-Black', 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],

      'montserrat-bold': ['Montserrat-Bold', 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],

      'montserrat-semibold': ['Montserrat-SemiBold', 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],

      'montserrat-extrabold': ['Montserrat-ExtraBold', 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],

      'montserrat-light': ['Montserrat-Light', 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],

      'montserrat-extralight': ['Montserrat-ExtraLight', 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],

      'montserrat-italic': ['Montserrat-Italic', 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],

      'montserrat-lightitalic': ['Montserrat-LightItalic', 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],

    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
