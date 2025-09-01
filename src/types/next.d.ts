export type NextSearchParams = Record<string, string | string[] | undefined>;

// It'd be better to have `params` typed as `Promise<{ locale: Locale }>`, and it was the case before,
// but since Next.js v15.5.0, it breaks the type checking and Next.js forces the type of `params` to
// be just `Promise<{ locale: string }>`.

export interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<NextSearchParams>;
}

export interface LayoutProps {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}
