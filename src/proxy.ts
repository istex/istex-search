import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(req: NextRequest) {
  const relevantHeaders = [
    "x-forwarded-for",
    "x-forwarded-host",
    "x-forwarded-port",
    "x-forwarded-proto",
  ];

  console.log("============ DEBUG START ============");
  console.log("HEADERS:");
  for (const header of relevantHeaders) {
    if (!req.headers.has(header)) {
      console.log(`${header} is missing`);
      continue;
    }

    const value = req.headers.get(header);
    console.log(`${header}: ${value}`);
  }
  console.log("============ DEBUG START ============");

  return handleI18nRouting(req);
}

export const config = {
  // Taken from here:
  // https://next-intl.dev/docs/routing/setup#proxy
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
