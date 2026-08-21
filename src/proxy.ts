import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import logger from "@/lib/logger";
import routing from "./i18n/routing";

// This middleware only adds logging on the top of the middleware provided
// by next-intl.

export default function proxy(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);

  logger.info({
    status: response.status,
    pathname: request.nextUrl.pathname,
  });

  return response;
}

export const config = {
  // Taken from here:
  // https://next-intl.dev/docs/routing/setup#proxy
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
