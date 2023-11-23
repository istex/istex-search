import { Suspense } from "react";
import { getTranslator } from "next-intl/server";
import ResultsPage from "./_page";
import Loading from "./loading";
import type { GenerateMetadata, Page } from "@/types/next";

export const generateMetadata: GenerateMetadata = async ({
  params: { locale },
}) => {
  const t = await getTranslator(locale, "results.metadata");

  return {
    title: `Istex-DL - ${t("title")}`,
  };
};

// We can't entirely rely on the automatic Suspense wrapping provided by Next.js through
// the loading.tsx file because a change in the URLSearchParams only isn't consireded
// actual page change. We have to wrap ResultsPage in Suspense ourselves and make sure it
// invalidated when the search params change.
// More info: https://github.com/vercel/next.js/issues/46258#issuecomment-1479233189
const _ResultsPage: Page = (props) => (
  <Suspense key={JSON.stringify(props.searchParams)} fallback={<Loading />}>
    <ResultsPage {...props} />
  </Suspense>
);

export default _ResultsPage;
