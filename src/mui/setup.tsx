"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import type { ClientComponent } from "@/types/next";

const EmotionCacheProvider: ClientComponent<unknown, true> = ({ children }) => {
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

const MuiSetup: ClientComponent<unknown, true> = ({ children }) => (
  <EmotionCacheProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </EmotionCacheProvider>
);

export default MuiSetup;
