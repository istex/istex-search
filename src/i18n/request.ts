import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const translations = (await import(`./translations/${locale}.json`)) as {
    default: Record<string, unknown>;
  };

  return {
    locale,
    messages: translations.default,
  };
});
