import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import routing from "@/i18n/routing";

export default async function sitemap() {
  "use cache";
  cacheLife("max");

  return [
    {
      url: "https://search.istex.fr",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            `https://search.istex.fr/${locale}`,
          ]),
        ),
      },
    },
  ] satisfies MetadataRoute.Sitemap;
}
