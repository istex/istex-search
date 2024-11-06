import * as React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ResultsPage from "./_page";
import Loading from "./loading";
import { redirect, routing } from "@/i18n/routing";
import type { GenerateMetadataProps, PageProps } from "@/types/next";

export async function generateMetadata(
  props: GenerateMetadataProps,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "results.metadata" });

  return {
    title: `Istex Search - ${t("title")}`,
  };
}

// We can't entirely rely on the automatic Suspense wrapping provided by Next.js through
// the loading.tsx file because a change in the URLSearchParams only isn't considered an
// actual page change. We have to wrap ResultsPage in Suspense ourselves and make sure it's
// invalidated when the search params change.
// More info: https://github.com/vercel/next.js/issues/46258#issuecomment-1479233189
export default async function _ResultsPage(props: PageProps) {
  // Redirect to the current page but with the default locale if the one
  // from the slot isn't supported
  const { locale } = await props.params;
  if (!routing.locales.includes(locale)) {
    redirect({
      href: { pathname: "/results", query: await props.searchParams },
      locale: routing.defaultLocale,
    });
  }

  // We want to trigger the Suspense only when search params that require
  // a new API call are changed
  const searchParams = await props.searchParams;
  const key = JSON.stringify({
    q: searchParams.q,
    q_id: searchParams.q_id,
    page: searchParams.page,
    perPage: searchParams.perPage,
    filters: searchParams.filters,
  });

  return (
    <React.Suspense key={key} fallback={<Loading />}>
      <ResultsPage /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
        {...props}
      />
    </React.Suspense>
  );
}
