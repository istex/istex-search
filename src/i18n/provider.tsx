"use client";

import {
  type AbstractIntlMessages,
  NextIntlClientProvider,
  useLocale,
} from "next-intl";
import { defaultTranslationValues } from "./i18n";
import type { ClientComponent } from "@/types/next";

const NextIntlProvider: ClientComponent<
  { messages: AbstractIntlMessages },
  true
> = ({ children, messages }) => {
  const locale = useLocale();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      defaultTranslationValues={defaultTranslationValues}
    >
      {children}
    </NextIntlClientProvider>
  );
};

export default NextIntlProvider;
