import createTheme from "@mui/material/styles/createTheme";
import { montserrat, openSans } from "./fonts";
import { type TypographyStyleOptions } from "@mui/material/styles/createTypography";

const colors = {
  darkGreen: "#a9bb1e",
  lightGreen: "#c4d733",
  blue: "#458ca5",
  darkBlack: "#1d1d1d",
  lightBlack: "#4a4a4a",
  white: "#f0f0f0",
} as const;

const headingOptions: TypographyStyleOptions = {
  fontFamily: montserrat.style.fontFamily,
  fontWeight: "bold",
};

const subtitleOptions: TypographyStyleOptions = {
  fontFamily: montserrat.style.fontFamily,
};

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
      black: colors.darkBlack,
      white: colors.white,
    },
    text: {
      primary: colors.lightBlack,
    },
  },
  typography: {
    fontFamily: openSans.style.fontFamily,
    h1: headingOptions,
    h2: headingOptions,
    h3: headingOptions,
    h4: headingOptions,
    h5: headingOptions,
    h6: headingOptions,
    subtitle1: subtitleOptions,
    subtitle2: subtitleOptions,
  },
});
