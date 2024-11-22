import { setRequestLocale } from "next-intl/server";
import CorpusSection from "./components/CorpusSection";
import CourseSection from "./components/CourseSection";
import DownloadSection from "./components/DownloadSection";
import SearchSection from "./components/SearchSection";
import { QueryProvider } from "@/contexts/QueryContext";
import { redirect, routing } from "@/i18n/routing";
import SearchParams from "@/lib/SearchParams";
import type { IstexApiResponse } from "@/lib/istexApi";
import type { PageProps } from "@/types/next";

// This function tells Next.js to pre-render (at build time) all pages in this layout
// for every supported locale
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage(props: PageProps) {
  const nextSearchParams = await props.searchParams;
  const { locale } = await props.params;

  // Redirect to the current page but with the default locale if the one
  // from the slot isn't supported
  if (!routing.locales.includes(locale)) {
    redirect({
      href: "/",
      locale: routing.defaultLocale,
    });
  }

  setRequestLocale(locale);

  const searchParams = new SearchParams(nextSearchParams);

  let queryString: string;
  try {
    queryString = await searchParams.getQueryString();
  } catch (_err) {
    // Getting on the home page with an invalid q_id could be a mistake
    // so we just delete it and refresh the page
    searchParams.deleteQueryString();
    redirect({ href: `/?${searchParams.toString()}`, locale });

    // This return is unnecessary because redirect throws an error internally but
    // typescript isn't smart enough to figure that out and thinks "queryString" below
    // will be used before it's assigned.
    return null;
  }

  const emptyResults: IstexApiResponse = {
    total: 0,
    hits: [],
    aggregations: {},
  };

  return (
    <QueryProvider queryString={queryString} results={emptyResults}>
      <SearchSection />
      <CorpusSection />
      <DownloadSection />
      <CourseSection />
    </QueryProvider>
  );
}
