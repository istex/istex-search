import { getTranslator, redirect } from "next-intl/server";
import DownloadButton from "./components/DownloadButton";
import ResultCard from "./components/ResultCard";
import ResultsGrid from "./components/ResultsGrid";
import ErrorCard from "@/components/ErrorCard";
import { getResults, type IstexApiResponse } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import type { GenerateMetadata, Page } from "@/types/next";

async function getTranslatedResults(
  queryString: string,
  locale: string
): Promise<IstexApiResponse> {
  const t = await getTranslator(locale, "results");

  const body = await getResults(queryString);

  // Fill some missing fields with placeholder texts
  body.hits.forEach((result) => {
    result.title ??= t("placeholders.noTitle");
    result.abstract ??= t("placeholders.noAbstract");
  });

  return body;
}

export const generateMetadata: GenerateMetadata = async ({
  params: { locale },
}) => {
  const t = await getTranslator(locale, "results.metadata");

  return {
    title: `Istex-DL - ${t("title")}`,
  };
};

const ResultsPage: Page = async ({
  params: { locale },
  searchParams: nextSearchParams,
}) => {
  const searchParams = useSearchParams(nextSearchParams);
  const queryString = searchParams.getQueryString();
  const size = searchParams.getSize();

  if (queryString === "") {
    redirect("/");
  }

  try {
    const results = await getTranslatedResults(queryString, locale);

    return (
      <>
        <ResultsGrid size={10} columns={2}>
          {results.hits.map((result) => (
            <ResultCard key={result.id} info={result} />
          ))}
        </ResultsGrid>

        <DownloadButton size={size !== 0 ? size : results.total} />
      </>
    );
  } catch (error) {
    return (
      error instanceof Error &&
      typeof error.cause === "number" && <ErrorCard code={error.cause} />
    );
  }
};

export default ResultsPage;
