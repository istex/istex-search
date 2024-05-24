import * as React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ResultsPage from "./_page";
import Loading from "./loading";
import type { GenerateMetadataProps, PageProps } from "@/types/next";

export async function generateMetadata({
  params: { locale },
}: GenerateMetadataProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "results.metadata" });

  return {
    title: `Istex Search - ${t("title")}`,
  };
}

// We can't entirely rely on the automatic Suspense wrapping provided by Next.js through
// the loading.tsx file because a change in the URLSearchParams only isn't consireded an
// actual page change. We have to wrap ResultsPage in Suspense ourselves and make sure it's
// invalidated when the search params change.
// More info: https://github.com/vercel/next.js/issues/46258#issuecomment-1479233189
export default function _ResultsPage(props: PageProps) {
  // We want to trigger the Suspense only when search params that require
  // a new API call are changed
  const key = JSON.stringify({
    q: props.searchParams.q,
    q_id: props.searchParams.q_id,
    page: props.searchParams.page,
    perPage: props.searchParams.perPage,
    filter: props.searchParams.filter,
  });

  return (
    <React.Suspense key={key} fallback={<Loading />}>
      <ResultsPage {...props} />
    </React.Suspense>
  );
}
