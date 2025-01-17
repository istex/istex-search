import { getTranslations } from "next-intl/server";
import { Stack } from "@mui/material";
import DownloadButton from "./components/DownloadButton";
import Filters from "./components/Filters";
import FilterTags from "./components/Filters/FilterTags";
import Pagination from "./components/Pagination";
import Panels from "./components/Panel/Panels";
import ResultGrid from "./components/ResultGrid";
import ResultsPageShell from "./components/ResultsPageShell";
import { redirect } from "@/i18n/routing";
import CustomError from "@/lib/CustomError";
import SearchParams from "@/lib/SearchParams";
import {
  getResults,
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

export default async function ResultsPage(props: PageProps) {
  const nextSearchParams = await props.searchParams;
  const { locale } = await props.params;
  const searchParams = new SearchParams(nextSearchParams);
  const page = searchParams.getPage();
  const perPage = searchParams.getPerPage();
  const filters = searchParams.getFilters();
  const sortBy = searchParams.getSortBy();
  const sortDir = searchParams.getSortDirection();
  const randomSeedFromSearchParams = searchParams.getRandomSeed();

  const emptyResults: IstexApiResponse = {
    total: 0,
    hits: [],
    aggregations: {},
  };

  let queryString: string;
  try {
    queryString = await searchParams.getQueryString();
  } catch (err) {
    return (
      <ResultsPageShell
        queryString=""
        results={emptyResults}
        errorInfo={err instanceof CustomError ? err.info : { name: "default" }}
      />
    );
  }

  if (queryString === "") {
    redirect({ href: "/", locale });
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
        results={emptyResults}
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

  return (
    <ResultsPageShell
      queryString={queryString}
      results={results}
      randomSeed={randomSeedToUse}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Filters />

        <Stack spacing={1} useFlexGap sx={{ flexGrow: 1 }}>
          <Panels />
          <FilterTags />
          <ResultGrid />
          <Pagination />
        </Stack>
      </Stack>

      <DownloadButton />
    </ResultsPageShell>
  );
}
