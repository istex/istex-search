import * as React from "react";
import type { RichTranslationValues } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@mui/material";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./navigation";

export const defaultTranslationValues: RichTranslationValues = {
  strong: (chunks) => <strong>{chunks}</strong>,
  br: () => <br />,
};

export function externalLink(href: string) {
  return function ExternalLink(chunks: React.ReactNode) {
    return (
      <Link href={href} target="_blank" rel="noreferrer">
        {chunks}
      </Link>
    );
  };
}

export function mailtoLink(email: string) {
  return function MailtoLink(chunks: React.ReactNode) {
    return <Link href={`mailto:${email}`}>{chunks}</Link>;
  };
}

export default getRequestConfig(async ({ locale }) => {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    redirect(`/${DEFAULT_LOCALE}`);
  }

  return {
    messages: (await import(`./translations/${locale}.json`)).default,
    defaultTranslationValues,
  };
});
