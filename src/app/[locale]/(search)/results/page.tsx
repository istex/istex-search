import { getTranslator, redirect } from "next-intl/server";
import DownloadButton from "./components/DownloadButton";
import ResultCard from "./components/ResultCard";
import ResultsCount from "./components/ResultsCount";
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
  const response = await getResults(queryString);

  // Fill some missing fields with placeholder texts
  response.hits.forEach((result) => {
    result.title ??= t("placeholders.noTitle");
    result.abstract ??= t("placeholders.noAbstract");
  });

  return response;
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

    // If the size is 0, take maxSize even if it's technically greater than 0 so
    // that users get maxSize by default and not 0
    const sizeToUse = size !== 0 ? size : results.total;

    return (
      <>
        <ResultsCount count={results.total} />
        <ResultsGrid size={10} columns={2}>
          {results.hits.map((result) => (
            <ResultCard key={result.id} info={result} />
          ))}
        </ResultsGrid>

        <DownloadButton size={sizeToUse} />
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
