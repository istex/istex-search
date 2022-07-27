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
          light: '#8f8f8f',
        },
        'istcolor-black': '#1d1d1d',
        'istcolor-white': '#f0f0f0',
        'istcolor-blue': '#458ca5',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
