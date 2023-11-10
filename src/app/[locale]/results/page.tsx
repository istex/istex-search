import { getTranslator, redirect } from "next-intl/server";
import DownloadButton from "./components/DownloadButton";
import Pagination from "./components/Pagination";
import ResultCard from "./components/ResultCard";
import ResultsGrid from "./components/ResultsGrid";
import ResultsPageShell from "./components/ResultsPageShell";
import ErrorCard from "@/components/ErrorCard";
import type { PerPageOption } from "@/config";
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
  const page = searchParams.getPage();
  const perPage = searchParams.getPerPage();

  let queryString: string;
  try {
    queryString = await searchParams.getQueryString();
  } catch (err) {
    // TODO: let the user know the q_id was not found
    redirect("/");
  }

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
      <ResultsPageShell queryString={queryString} resultsCount={results.total}>
        <ResultsGrid>
          {results.hits.map((result) => (
            <ResultCard key={result.id} info={result} />
          ))}
        </ResultsGrid>

        <Pagination />
        <DownloadButton />
      </ResultsPageShell>
    );
  } catch (error) {
    const errorCode =
      error instanceof Error && typeof error.cause === "number"
        ? error.cause
        : undefined;

    return (
      <ResultsPageShell queryString={queryString} resultsCount={0}>
        <ErrorCard code={errorCode} />
      </ResultsPageShell>
    );
  }
};

export default ResultsPage;
