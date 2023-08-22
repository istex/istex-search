import { getTranslator, redirect } from "next-intl/server";
import DownloadButton from "./components/DownloadButton";
import ResultCard from "./components/ResultCard";
import ResultsGrid from "./components/ResultsGrid";
import ErrorCard from "@/components/ErrorCard";
import { istexApiConfig } from "@/config";
import { getResults, type IstexApiResponse } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import { clamp } from "@/lib/utils";
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
    const maxSizeToUse = clamp(results.total, 0, istexApiConfig.maxSize);
    const sizeToUse = clamp(size, 0, maxSizeToUse);

    return (
      <>
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
