"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import type {
  EmotionCache,
  Options as OptionsOfCreateCache,
} from "@emotion/cache";
import { CacheProvider as DefaultCacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from "./theme";
import type { ClientComponent } from "@/types/next";

// The EmotionCacheProvider taken from here:
// https://github.com/mui/material-ui/blob/master/examples/material-next-app-router-ts/src/components/ThemeRegistry/EmotionCache.tsx

interface EmotionCacheProviderProps {
  /** This is the options passed to createCache() from 'import createCache from "@emotion/cache"' */
  options: Omit<OptionsOfCreateCache, "insertionPoint">;
  /** By default <CacheProvider /> from 'import { CacheProvider } from "@emotion/react"' */
  CacheProvider?: (props: {
    value: EmotionCache;
    children: React.ReactNode;
  }) => React.JSX.Element | null;
}

const EmotionCacheProvider: ClientComponent<EmotionCacheProviderProps, true> = (
  props
) => {
  const { options, CacheProvider = DefaultCacheProvider, children } = props;

  const [registry] = useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: Array<{ name: string; isGlobal: boolean }> = [];
    cache.insert = (...args) => {
      const [selector, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({
          name: serialized.name,
          isGlobal: selector === "",
        });
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const inserted = registry.flush();
    if (inserted.length === 0) {
      return null;
    }
    let styles = "";
    let dataEmotionAttribute = registry.cache.key;

    const globals: Array<{
      name: string;
      style: string;
    }> = [];

    inserted.forEach(({ name, isGlobal }) => {
      const style = registry.cache.inserted[name];

      if (typeof style !== "boolean") {
        if (isGlobal) {
          globals.push({ name, style });
        } else {
          styles += style;
          dataEmotionAttribute += ` ${name}`;
        }
      }
    });

    return (
      <>
        {globals.map(({ name, style }) => (
          <style
            key={name}
            data-emotion={`${registry.cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        ))}
        {styles !== "" && (
          <style
            key={registry.cache.key}
            data-emotion={dataEmotionAttribute}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        )}
      </>
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
};

const MuiSetup: ClientComponent<Record<string, unknown>, true> = ({
  children,
}) => (
  <EmotionCacheProvider options={{ key: "mui" }}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </EmotionCacheProvider>
);

export default MuiSetup;
