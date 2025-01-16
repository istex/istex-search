"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import * as locales from "@mui/material/locale";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

interface MuiSetupProps {
  locale: string;
  children: React.ReactNode;
}

// Using the theme as is throws with "`vars` is a private field used for CSS variables support." because the initial
// call to createTheme generated the CSS variables so we need to remove them first.
// With this workaround, the CSS variables are generated, removed, then generated again so it's far from optimal...
const { vars, ...themeWithoutVars } = theme;

export default function MuiSetup({ locale, children }: MuiSetupProps) {
  const themeWithLocale = React.useMemo(
    () => createTheme(themeWithoutVars, locales[localeToMuiImportName(locale)]),
    [locale],
  );

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={themeWithLocale}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

function localeToMuiImportName(locale: string) {
  // locales follow the format '<lang>-<country>' and the MUI import name have
  // the same format but without the hyphen
  return locale.replace("-", "") as keyof typeof locales;
}
