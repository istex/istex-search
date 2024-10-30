import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // NOTE: It seems like routing.locales can't be used for the matcher because
  // it needs to a string literal, and not a template literal. When another language
  // is added, it'll be necessary to replace "fr-FR" with "(fr-FR|en-US)" for example.
  matcher: ["/", "/fr-FR/:path*"],
};
