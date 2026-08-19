import { defineRouting } from "next-intl/routing";

const routing = defineRouting({
  locales: ["fr-FR", "en-GB", "es-ES"],
  defaultLocale: "fr-FR",
});

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
  }
}

export default routing;
