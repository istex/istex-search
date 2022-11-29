const fallbackFonts = [
  'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
  'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif',
];

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
          link: '#4a4a4a',
          medium: '#adadad',
          light: '#8f8f8f',
          'extra-light': '#dadada',
        },
        'istcolor-black': '#1d1d1d',
        'istcolor-white': '#f0f0f0',
        'istcolor-blue': '#458ca5',
        'istcolor-red': '#d9534f',
      },
    },
    fontFamily: {
      'montserrat-regular': ['Montserrat-Regular', ...fallbackFonts],
      'montserrat-medium': ['Montserrat-Medium', ...fallbackFonts],
      'montserrat-bold': ['Montserrat-Bold', ...fallbackFonts],
      'montserrat-semibold': ['Montserrat-SemiBold', ...fallbackFonts],
      'opensans-regular': ['OpenSans-Regular', ...fallbackFonts],
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/line-clamp'),
  ],
};
