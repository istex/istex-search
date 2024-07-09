import { getTranslations } from "next-intl/server";
import { Stack } from "@mui/material";
import DownloadButton from "./components/DownloadButton";
import type { FacetList } from "./components/Facets/FacetContext";
import FacetsContainer from "./components/Facets/FacetsContainer";
import {
  COMPATIBILITY_FACETS,
  INDICATORS_FACETS,
  FACETS,
} from "./components/Facets/constants";
import Filters from "./components/Filters/Filters";
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

  const facets: FacetList = {};
  const indicators: Aggregation = {};
  const compatibility: Aggregation = {};
  for (const facetTitle in results.aggregations) {
    if (FACETS.some((facet) => facet.name === facetTitle)) {
      const facetItemList = results.aggregations[facetTitle].buckets;

      facets[facetTitle] = facetItemList.map((facetItem) => ({
        ...facetItem,
        selected:
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          filters[facetTitle]?.includes(
            facetItem.keyAsString ?? facetItem.key.toString(),
          ) ?? false,
        excluded:
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          filters[facetTitle]?.includes(
            `!${facetItem.keyAsString ?? facetItem.key.toString()}`,
          ) ?? false,
      }));
    }

    if (INDICATORS_FACETS.some((facet) => facet.name === facetTitle)) {
      indicators[facetTitle] = results.aggregations[facetTitle];
    }
    if (COMPATIBILITY_FACETS.some((facet) => facet.name === facetTitle)) {
      compatibility[facetTitle] = results.aggregations[facetTitle];
    }
  }

  return (
    <ResultsPageShell
      queryString={queryString}
      resultsCount={results.total}
      randomSeed={randomSeedToUse}
      facets={facets}
      results={results}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        alignItems="start"
      >
        <FacetsContainer />

        <Stack gap={1} width="100%">
          <Panels indicators={indicators} compatibility={compatibility} />

          <Filters />

          <ResultsGrid results={results.hits} />

          <Pagination />
        </Stack>
      </Stack>

      <DownloadButton />
    </ResultsPageShell>
  );
}
