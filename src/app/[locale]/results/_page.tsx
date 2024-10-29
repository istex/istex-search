import { getTranslations } from "next-intl/server";
import { Stack } from "@mui/material";
import DownloadButton from "./components/DownloadButton";
import Filters from "./components/Filters";
import FilterTags from "./components/Filters/FilterTags";
import Pagination from "./components/Pagination";
import Panels from "./components/Panel/Panels";
import ResultsGrid from "./components/ResultsGrid";
import ResultsPageShell from "./components/ResultsPageShell";
import { redirect } from "@/i18n/navigation";
import CustomError from "@/lib/CustomError";
import SearchParams from "@/lib/SearchParams";
import {
  getResults,
  type Aggregation,
  type GetResultsOptions,
  type IstexApiResponse,
} from "@/lib/istexApi";
import type { PageProps } from "@/types/next";

async function getTranslatedResults(
  options: GetResultsOptions & { locale: string },
): Promise<IstexApiResponse> {
  const t = await getTranslations({
    locale: options.locale,
    namespace: "results",
  });
  const response = await getResults(options);

  // Fill some missing fields with placeholder texts
  response.hits.forEach((result) => {
    result.title ??= t("placeholders.noTitle");
    result.abstract ??= t("placeholders.noAbstract");
  });

  return response;
}

export default async function ResultsPage({
  params: { locale },
  searchParams: nextSearchParams,
}: PageProps) {
  const searchParams = new SearchParams(nextSearchParams);
  const page = searchParams.getPage();
  const perPage = searchParams.getPerPage();
  const filters = searchParams.getFilters();
  const sortBy = searchParams.getSortBy();
  const sortDir = searchParams.getSortDirection();
  const randomSeedFromSearchParams = searchParams.getRandomSeed();

  let queryString: string;
  try {
    queryString = await searchParams.getQueryString();
  } catch (err) {
    return (
      <ResultsPageShell
        queryString=""
        resultsCount={0}
        errorInfo={err instanceof CustomError ? err.info : { name: "default" }}
      />
    );
  }

  if (queryString === "") {
    redirect("/");
  }

  let results;
  try {
    results = await getTranslatedResults({
      queryString,
      perPage,
      page,
      filters,
      sortBy,
      sortDir,
      locale,
      randomSeed: randomSeedFromSearchParams,
    });
  } catch (err) {
    return (
      <ResultsPageShell
        queryString={queryString}
        resultsCount={0}
        errorInfo={err instanceof CustomError ? err.info : { name: "default" }}
      />
    );
  }

  // Get the potential random seed in the pagination URLs sent by the API
  let randomSeedToUse;
  if (results.total > 0 && results.firstPageURI != null) {
    const firstPageUrl = new URL(results.firstPageURI);
    const randomSeedFromResults = firstPageUrl.searchParams.get("randomSeed");

    if (randomSeedFromSearchParams != null) {
      randomSeedToUse = randomSeedFromSearchParams;
    } else if (randomSeedFromResults != null) {
      randomSeedToUse = randomSeedFromResults;
    }
  }

  const indicators: Aggregation = results.aggregations;
  const compatibility: Aggregation = results.aggregations;

  return (
    <ResultsPageShell
      queryString={queryString}
      resultsCount={results.total}
      randomSeed={randomSeedToUse}
      results={results}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          alignItems: "start",
        }}
      >
        <Filters />

        <Stack
          spacing={1}
          useFlexGap
          sx={{
            flexGrow: 1,
          }}
        >
          <Panels indicators={indicators} compatibility={compatibility} />

          <FilterTags />

          <ResultsGrid results={results.hits} />

          <Pagination />
        </Stack>
      </Stack>

      <DownloadButton />
    </ResultsPageShell>
  );
}
