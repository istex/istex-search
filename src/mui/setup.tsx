"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import * as locales from "@mui/material/locale";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

interface MuiSetupProps {
  children: React.ReactNode;
}

export default function MuiSetup({ children }: MuiSetupProps) {
  const locale = useLocale();
  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[localeToMuiImportName(locale)]),
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
