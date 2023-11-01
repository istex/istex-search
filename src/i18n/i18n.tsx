import type { ReactNode } from "react";
import type { RichTranslationValues } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { Link } from "@mui/material";

export const defaultTranslationValues: RichTranslationValues = {
  strong: (chunks) => <strong>{chunks}</strong>,
  br: () => <br />,
};

export function externalLink(href: string) {
  return function ExternalLink(chunks: ReactNode) {
    return (
      <Link href={href} target="_blank" rel="noreferrer">
        {chunks}
      </Link>
    );
  };
}

export default getRequestConfig(async ({ locale }) => {
  const translations = (await import(`./translations/${locale}.json`)).default;

  return {
    messages: translations,
    defaultTranslationValues,
  };
});
