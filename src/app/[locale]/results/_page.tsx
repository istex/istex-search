import { Stack } from "@mui/material";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import CustomError from "@/lib/CustomError";
import {
  type GetResultsOptions,
  getResults,
  type IstexApiResponse,
} from "@/lib/istexApi";
import logger from "@/lib/logger";
import { getQueryStringFromQId, loadSearchParams } from "@/lib/searchParams";
import DownloadButton from "./components/DownloadButton";
import Filters from "./components/Filters";
import FilterTags from "./components/Filters/FilterTags";
import Pagination from "./components/Pagination";
import Panels from "./components/Panel/Panels";
import ResultGrid from "./components/ResultGrid";
import ResultsPageShell from "./components/ResultsPageShell";

async function getTranslatedResults(
  options: GetResultsOptions,
): Promise<IstexApiResponse> {
  const t = await getTranslations("results");
  const response = await getResults(options);

  // Fill some missing fields with placeholder texts
  response.hits.forEach((result) => {
    result.title ??= t("placeholders.noTitle");
    result.abstract ??= t("placeholders.noAbstract");
  });

  return response;
}

export default async function ResultsPage(
  props: PageProps<"/[locale]/results">,
) {
  const locale = await getLocale();
  const {
    queryString: queryStringFromSearchParams,
    qId,
    filters,
    page,
    perPage,
    sortBy,
    sortDirection,
    randomSeed: randomSeedFromSearchParams,
  } = await loadSearchParams(props.searchParams);

  const emptyResults: IstexApiResponse = {
    total: 0,
    hits: [],
    aggregations: {},
  };

  // If we don't have a queryString but a q_id is present, we try to get the
  // queryString from it.
  let queryString = queryStringFromSearchParams;
  if (queryString == null && qId != null) {
    try {
      queryString = await getQueryStringFromQId(qId);
    } catch (err) {
      return (
        <ResultsPageShell
          queryString=""
          results={emptyResults}
          errorInfo={
            err instanceof CustomError ? err.info : { name: "default" }
          }
        />
      );
    }
  }

  // If we didn't manage to get a queryString, we just redirect to the home page.
  if (queryString == null) {
    logger.warn(
      `Access to '/results' without a query string, redirecting to '/${locale}'.`,
    );
    return redirect({ href: "/", locale });
  }

  let results: IstexApiResponse;
  try {
    results = await getTranslatedResults({
      queryString,
      perPage,
      page,
      filters,
      sortBy,
      sortDirection,
      randomSeed: randomSeedFromSearchParams ?? undefined,
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
  let randomSeedToUse = randomSeedFromSearchParams ?? undefined;
  if (results.total > 0 && results.firstPageURI != null) {
    const firstPageUrl = new URL(results.firstPageURI);
    const randomSeedFromResults = firstPageUrl.searchParams.get("randomSeed");

    if (randomSeedFromResults != null) {
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
