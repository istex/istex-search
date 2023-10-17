"use client";

import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { defaultTranslationValues } from "./i18n";
import type { ClientComponent } from "@/types/next";

interface NextIntlProviderProps {
  messages: AbstractIntlMessages;
  locale: string;
}

// This custom provider only exists because it needs to be a client component
// (defaultTranslationsValues has non-serializable properties)
const NextIntlProvider: ClientComponent<NextIntlProviderProps, true> = ({
  children,
  messages,
  locale,
}) => (
  <NextIntlClientProvider
    locale={locale}
    messages={messages}
    defaultTranslationValues={defaultTranslationValues}
  >
    {children}
  </NextIntlClientProvider>
);

export default NextIntlProvider;
