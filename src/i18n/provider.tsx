"use client";

import type { ComponentProps } from "react";
import { NextIntlClientProvider } from "next-intl";
import { defaultTranslationValues } from "./i18n";
import type { ClientComponent } from "@/types/next";

// This custom provider only exists because it needs to be a client component
// (defaultTranslationsValues has non-serializable properties)
const NextIntlProvider: ClientComponent<
  ComponentProps<typeof NextIntlClientProvider>,
  true
> = ({ children, ...rest }) => (
  <NextIntlClientProvider
    defaultTranslationValues={defaultTranslationValues}
    {...rest}
  >
    {children}
  </NextIntlClientProvider>
);

export default NextIntlProvider;
