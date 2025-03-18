import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Taken from here:
  // https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#middleware
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
