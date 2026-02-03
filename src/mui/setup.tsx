"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { frFR, type Localization } from "@mui/material/locale";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { Locale } from "next-intl";
import type * as React from "react";
import theme from "./theme";

interface MuiSetupProps {
  locale: Locale;
  children: React.ReactNode;
}

// Update this map if another locale is ever added
const localeMap: Record<Locale, Localization> = {
  "fr-FR": frFR,
};

// Using the theme as is throws with "`vars` is a private field used for CSS variables support." because the initial
// call to createTheme generated the CSS variables so we need to remove them first.
// With this workaround, the CSS variables are generated, removed, then generated again so it's far from optimal...
const { vars, ...themeWithoutVars } = theme;

export default function MuiSetup({ locale, children }: MuiSetupProps) {
  const themeWithLocale = createTheme(themeWithoutVars, localeMap[locale]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={themeWithLocale}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
