import { getTranslator, redirect } from "next-intl/server";
import DownloadButton from "./components/DownloadButton";
import ResultCard, { type Result } from "./components/ResultCard";
import ResultsGrid from "./components/ResultsGrid";
import { buildResultPreviewUrl } from "@/lib/istexApi";
import { nextSearchParamsToUrlSearchParams } from "@/lib/utils";
import type { GenerateMetadata, Page } from "@/types/next";

interface IstexApiResponse {
  total: number;
  hits: Result[];
}

async function getResults(
  queryString: string,
  locale: string
): Promise<IstexApiResponse> {
  const t = await getTranslator(locale, "results");

  // Create the URL
  const url = buildResultPreviewUrl({
    queryString,
    size: 10,
    fields: ["title", "host.title", "author", "abstract"],
  });

  // API call
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`API responded with a ${response.status} status code!`);
  }

  // Fill some missing fields with placeholder texts
  const body: IstexApiResponse = await response.json();
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
  const searchParams = nextSearchParamsToUrlSearchParams(nextSearchParams);
  const queryString = searchParams.get("q");

  if (queryString == null) {
    redirect("/");
  }

  const results = await getResults(queryString, locale);

  return (
    <>
      <ResultsGrid size={10} columns={2}>
        {results.hits.map((result) => (
          <ResultCard key={result.id} info={result} />
        ))}
      </ResultsGrid>

      <DownloadButton numberOfDocuments={results.total} />
    </>
  );
};

export default ResultsPage;
