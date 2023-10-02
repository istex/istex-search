import type { RichTranslationValues } from "next-intl";
import { getRequestConfig } from "next-intl/server";

export const defaultTranslationValues: RichTranslationValues = {
  strong: (chunks) => <strong>{chunks}</strong>,
  br: () => <br />,
};

export default getRequestConfig(async ({ locale }) => {
  const translations = (await import(`./translations/${locale}.json`)).default;

  return {
    messages: translations,
    defaultTranslationValues,
  };
});
