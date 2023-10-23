import { getTranslator, redirect } from "next-intl/server";
import DownloadButton from "./components/DownloadButton";
import Pagination from "./components/Pagination";
import ResultCard from "./components/ResultCard";
import ResultsGrid from "./components/ResultsGrid";
import ErrorCard from "@/components/ErrorCard";
import type { PerPageOption } from "@/config";
import ResultsProvider from "@/contexts/ResultsContext";
import { getResults, type IstexApiResponse } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import type { GenerateMetadata, Page } from "@/types/next";

async function getTranslatedResults(
  queryString: string,
  perPage: PerPageOption,
  page: number,
  locale: string,
): Promise<IstexApiResponse> {
  const t = await getTranslator(locale, "results");
  const response = await getResults(queryString, perPage, page);

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
  const page = searchParams.getPage();
  const perPage = searchParams.getPerPage();

  if (queryString === "") {
    redirect("/");
  }

  try {
    const results = await getTranslatedResults(
      queryString,
      perPage,
      page,
      locale,
    );

    return (
      <ResultsProvider resultsCount={results.total}>
        <ResultsGrid>
          {results.hits.map((result) => (
            <ResultCard key={result.id} info={result} />
          ))}
        </ResultsGrid>

        <Pagination />
        <DownloadButton />
      </ResultsProvider>
    );
  } catch (error) {
    return (
      error instanceof Error &&
      typeof error.cause === "number" && <ErrorCard code={error.cause} />
    );
  }
};

export default ResultsPage;
