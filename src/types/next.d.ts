export type NextSearchParams = Record<string, string | string[] | undefined>;

export interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<NextSearchParams>;
}

export interface LayoutProps {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export type GenerateMetadataProps = PageProps;
