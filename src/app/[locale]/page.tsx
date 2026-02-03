import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { QueryProvider } from "@/contexts/QueryContext";
import { redirect, routing } from "@/i18n/routing";
import type { IstexApiResponse } from "@/lib/istexApi";
import logger from "@/lib/logger";
import SearchParams from "@/lib/SearchParams";
import CorpusSection from "./components/CorpusSection";
import CourseSection from "./components/CourseSection";
import DownloadSection from "./components/DownloadSection";
import SearchSection from "./components/SearchSection";

// This function tells Next.js to pre-render (at build time) all pages in this layout
// for every supported locale
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage(props: PageProps<"/[locale]">) {
  const nextSearchParams = await props.searchParams;
  const locale = (await props.params).locale as Locale;

  logger.info({
    status: 200,
    pathname: `/${locale}`,
  });

  // Redirect to the current page but with the default locale if the one
  // from the slot isn't supported
  if (!routing.locales.includes(locale)) {
    logger.warn(
      `Unsupported locale '${locale}', redirecting to '/${routing.defaultLocale}'.`,
    );
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
    logger.warn(
      `Tried to access '/' with a q_id, this is probably a mistake. Redirecting to '/${locale}'`,
    );
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
