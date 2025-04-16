import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
}
