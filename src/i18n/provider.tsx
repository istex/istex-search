"use client";

import * as React from "react";
import { NextIntlClientProvider } from "next-intl";
import { defaultTranslationValues } from "./i18n";

interface NextIntlProviderProps
  extends React.ComponentProps<typeof NextIntlClientProvider> {
  children: React.ReactNode;
}

// This custom provider only exists because it needs to be a client component
// (defaultTranslationsValues has non-serializable properties)
export default function NextIntlProvider({
  children,
  ...rest
}: NextIntlProviderProps) {
  return (
    <NextIntlClientProvider
      defaultTranslationValues={defaultTranslationValues}
      {...rest}
    >
      {children}
    </NextIntlClientProvider>
  );
}
