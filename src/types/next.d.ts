export type NextSearchParams = Record<string, string | string[] | undefined>;

export interface PageProps {
  params: { locale: string };
  searchParams: NextSearchParams;
}

export interface LayoutProps {
  params: { locale: string };
  children: React.ReactNode;
}

export type GenerateMetadataProps = PageProps;
