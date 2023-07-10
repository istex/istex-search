"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
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
}) => (
  <EmotionCacheProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Wrapping the children in a fragment is a strange hack to remove the
      children prop type validation error caused by server components */}
      <>{children}</>
    </ThemeProvider>
  </EmotionCacheProvider>
);

export default MuiSetup;
