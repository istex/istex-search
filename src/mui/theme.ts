import createTheme from "@mui/material/styles/createTheme";
import { Montserrat, Open_Sans } from "next/font/google";

const colors = {
  green: {
    dark: "#a9bb1e",
    light: "#c4d733",
  },
  blue: "#458ca5",
  black: {
    dark: "#1d1d1d",
    light: "#4a4a4a",
  },
  white: "#f0f0f0",
} as const;

const montserrat = Montserrat({
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
});

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
});

// Extend the PaletteOptions definition with our custom colors
declare module "@mui/material/styles/createPalette" {
  interface Palette {
    colors: typeof colors;
  }

  interface PaletteOptions {
    colors: typeof colors;
  }
}

export default createTheme({
  palette: {
    colors,
    common: {
      black: colors.black.dark,
      white: colors.white,
    },
    text: {
      primary: colors.black.light,
    },
  },
  typography: {
    fontFamily: openSans.style.fontFamily,
    h3: {
      fontFamily: montserrat.style.fontFamily,
      fontWeight: "bold",
    },
    h5: {
      fontFamily: montserrat.style.fontFamily,
      fontWeight: "bold",
    },
    subtitle1: {
      fontFamily: montserrat.style.fontFamily,
    },
  },
});
