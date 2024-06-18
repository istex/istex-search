import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const SUPPORTED_LOCALES = ["fr-FR"] as const;
export const DEFAULT_LOCALE = SUPPORTED_LOCALES[0];
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({
    locales: SUPPORTED_LOCALES,
  });
