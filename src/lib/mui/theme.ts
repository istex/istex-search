import { createTheme } from '@mui/material';
import { Montserrat, Open_Sans } from 'next/font/google';

const colors = {
  green: {
    dark: '#A9BB1E',
    light: '#C4D733',
  },
  blue: '#458CA5',
  black: '#1D1D1D',
  white: '#F0F0F0',
} as const;

const montserrat = Montserrat({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'latin-ext'],
});

const openSans = Open_Sans({
  subsets: ['latin', 'latin-ext'],
});

// Extend the PaletteOptions definition with our custom colors
declare module '@mui/material/styles' {
  interface PaletteOptions {
    colors: typeof colors;
  }
}

export default createTheme({
  palette: {
    colors,
    text: {
      primary: colors.black,
    },
  },
  typography: {
    fontFamily: openSans.style.fontFamily,
    h3: {
      fontFamily: montserrat.style.fontFamily,
      fontWeight: 'bold',
    },
    h5: {
      fontFamily: montserrat.style.fontFamily,
      fontWeight: 'bold',
    },
  },
});
