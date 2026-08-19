import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { redirect } from "./navigation";
import routing from "./routing";

export default getRequestConfig(async () => {
  const paramValue = await rootParams.locale();

  let locale = routing.defaultLocale;
  if (hasLocale(routing.locales, paramValue)) {
    locale = paramValue;
  } else {
    redirect({ href: "/", locale: routing.defaultLocale });
  }

  const translations = (await import(`./translations/${locale}`)) as {
    default: Record<string, unknown>;
  };

  return {
    locale,
    messages: translations.default,
  };
});
