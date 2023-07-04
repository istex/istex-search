import createMiddleware from "next-intl/middleware";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./i18n/constants";

export default createMiddleware({
  locales: SUPPORTED_LOCALES.map(({ code }) => code),
  defaultLocale: DEFAULT_LOCALE,
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
