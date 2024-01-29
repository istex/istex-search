import createMiddleware from "next-intl/middleware";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./i18n/navigation";

export default createMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

export const config = {
  // Match only internationalized pathnames
  // NOTE: It seems like SUPPORTED_LOCALES can't be used for the matcher because
  // it needs to a string literal. When another language is added, it'll be necessary to
  // replace "fr" with "(fr|en)" for example.
  matcher: ["/", "/fr/:path*"],
};
