import { createTheme } from "@mui/material/styles";
import type { TypographyStyle } from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { montserrat, openSans } from "./fonts";

const colors = {
  veryDarkGreen: "#667F00",
  darkGreen: "#a9bb1e",
  lightGreen: "#c4d733",
  veryLightGreen: "#E3EF63",
  blue: "#458ca5",
  variantBlue: "#5BC0DE",
  lightBlue: "#edf3f6",
  veryLightBlue: "#f6f9fa",
  lightRed: "#ff00001a",
  grey: "#8f8f8f",
  lightGrey: "#D9D9D9",
  darkBlack: "#1d1d1d",
  lightBlack: "#4a4a4a",
  veryLightBlack: "#4a4a4a33",
  red: "#d34315",
  white: "#f0f0f0",
} as const;

// Extend the PaletteOptions definition with our custom colors
declare module "@mui/material/styles" {
  interface Palette {
    colors: typeof colors;
  }

  interface PaletteOptions {
    colors: typeof colors;
  }
}

const headingOptions: TypographyStyle = {
  fontFamily: montserrat.style.fontFamily,
  fontWeight: "bold",
};

const subtitleOptions: TypographyStyle = {
  fontFamily: montserrat.style.fontFamily,
};

export default createTheme({
  cssVariables: {
    nativeColor: true,
  },
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
    error: {
      main: colors.red,
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
    MuiSkeleton: {
      defaultProps: {
        variant: "rounded",
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        ul, ol {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        body {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
      `,
    },
  },
});
