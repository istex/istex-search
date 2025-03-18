import type { Locale } from "next-intl";

export type NextSearchParams = Record<string, string | string[] | undefined>;

export interface PageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<NextSearchParams>;
}

export interface LayoutProps {
  params: Promise<{ locale: Locale }>;
  children: React.ReactNode;
}
