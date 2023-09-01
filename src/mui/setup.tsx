"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import * as locales from "@mui/material/locale";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import type { ClientComponent } from "@/types/next";

const EmotionCacheProvider: ClientComponent<Record<string, unknown>, true> = ({
  children,
}) => {
  const [cache] = useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => (
    <style
      key={cache.key}
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

const MuiSetup: ClientComponent<Record<string, unknown>, true> = ({
  children,
}) => {
  const locale = useLocale();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[localeToMuiImportName(locale)]),
    [locale]
  );

  return (
    <EmotionCacheProvider>
      <ThemeProvider theme={themeWithLocale}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionCacheProvider>
  );
};

function localeToMuiImportName(locale: string) {
  // locales follow the format '<lang>-<country>' and the MUI import name have
  // the same format but without the hyphen
  return locale.replace("-", "") as keyof typeof locales;
}

export default MuiSetup;
