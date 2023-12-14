import { createTheme } from "@mui/material/styles";
import type { TypographyStyleOptions } from "@mui/material/styles/createTypography";
import { montserrat, openSans } from "./fonts";

const colors = {
  darkGreen: "#a9bb1e",
  lightGreen: "#c4d733",
  blue: "#458ca5",
  lightBlue: "#edf3f6",
  veryLightBlue: "#f6f9fa",
  grey: "#8f8f8f",
  darkBlack: "#1d1d1d",
  lightBlack: "#4a4a4a",
  red: "#d34315",
  white: "#f0f0f0",
} as const;

// Extend the PaletteOptions definition with our custom colors
declare module "@mui/material/styles/createPalette" {
  interface Palette {
    colors: typeof colors;
  }

  interface PaletteOptions {
    colors: typeof colors;
  }
}

const headingOptions: TypographyStyleOptions = {
  fontFamily: montserrat.style.fontFamily,
  fontWeight: "bold",
};

const subtitleOptions: TypographyStyleOptions = {
  fontFamily: montserrat.style.fontFamily,
};

export default createTheme({
  palette: {
    colors,
    primary: {
      main: colors.blue,
    },
    secondary: {
      main: colors.lightGreen,
    },
    common: {
      black: colors.darkBlack,
      white: colors.white,
    },
    text: {
      primary: colors.lightBlack,
    },
    info: {
      main: colors.blue,
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
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        ul, ol {
          list-style: none;
          margin: 0;
          padding: 0;
        }
      `,
    },
  },
});
