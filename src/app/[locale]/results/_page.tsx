import { getTranslations } from "next-intl/server";
import { Paper, Stack, Typography } from "@mui/material";
import Filters from "./Filters/Filters";
import Panels from "./Panel/Panels";
import DownloadButton from "./components/DownloadButton";
import Pagination from "./components/Pagination";
import ResultCard from "./components/ResultCard";
import ResultsGrid from "./components/ResultsGrid";
import ResultsPageShell from "./components/ResultsPageShell";
import ShareButton from "./components/ShareButton";
import type { FacetList } from "./facets/FacetContext";
import FacetsContainer from "./facets/FacetsContainer";
import {
  COMPATIBILITY_FACETS,
  INDICATORS_FACETS,
  FACETS,
} from "./facets/constants";
import ErrorCard from "@/components/ErrorCard";
import { redirect } from "@/i18n/navigation";
import CustomError from "@/lib/CustomError";
import {
  getResults,
  type Aggregation,
  type GetResultsOptions,
  type IstexApiResponse,
} from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import type { Page } from "@/types/next";

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

const ResultsPage: Page = async ({
  params: { locale },
  searchParams: nextSearchParams,
}) => {
  const searchParams = useSearchParams(nextSearchParams);
  const page = searchParams.getPage();
  const perPage = searchParams.getPerPage();
  const filters = searchParams.getFilters();
  const lastAppliedFacet = searchParams.getLastAppliedFacet();
  const sortBy = searchParams.getSortBy();
  const sortDir = searchParams.getSortDirection();
  const randomSeedFromSearchParams = searchParams.getRandomSeed();
  const t = await getTranslations({ locale, namespace: "results" });

  let queryString: string;
  try {
    queryString = await searchParams.getQueryString();
  } catch (err) {
    return err instanceof CustomError ? (
      <ResultsPageShell queryString="" resultsCount={0}>
        <ErrorCard info={err.info} />
      </ResultsPageShell>
    ) : null;
  }

  if (queryString === "") {
    redirect("/");
  }

  try {
    const { [lastAppliedFacet]: _, ...filtersWithoutLastAppliedFacet } =
      filters;

    const [results, resultsWithoutLastAppliedFacet] = await Promise.all([
      getTranslatedResults({
        queryString,
        perPage,
        page,
        filters,
        sortBy,
        sortDir,
        locale,
        randomSeed: randomSeedFromSearchParams,
      }),
      lastAppliedFacet !== ""
        ? getResults({
            queryString,
            perPage,
            page,
            filters: filtersWithoutLastAppliedFacet,
            sortBy,
            sortDir,
            randomSeed: randomSeedFromSearchParams,
          })
        : undefined,
    ]);

    // Get the potential random seed in the pagination URLs sent by the API
    const firstPageUrl = new URL(results.firstPageURI);
    const randomSeedFromResults = firstPageUrl.searchParams.get("randomSeed");

    let randomSeedToUse;
    if (randomSeedFromSearchParams != null) {
      randomSeedToUse = randomSeedFromSearchParams;
    } else if (randomSeedFromResults != null) {
      randomSeedToUse = randomSeedFromResults;
    }

    const facets: FacetList = {};
    const indicators: Aggregation = {};
    const compatibility: Aggregation = {};
    for (const facetTitle in results.aggregations) {
      if (FACETS.some((facet) => facet.name === facetTitle)) {
        const facetItemList =
          facetTitle === lastAppliedFacet &&
          resultsWithoutLastAppliedFacet !== undefined
            ? resultsWithoutLastAppliedFacet.aggregations[facetTitle].buckets
            : results.aggregations[facetTitle].buckets;

        facets[facetTitle] = facetItemList.map((facetItem) => ({
          ...facetItem,
          selected:
            filters[facetTitle]?.includes(
              facetItem.keyAsString ?? facetItem.key.toString(),
            ) ?? false,
          excluded:
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
        {results.total > 0 ? (
          <>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              alignItems="start"
            >
              <FacetsContainer />

              <Stack gap={1}>
                <Panels indicators={indicators} compatibility={compatibility} />

                <Filters />

                <ResultsGrid>
                  {results.hits.map((result) => (
                    <ResultCard key={result.id} info={result} />
                  ))}
                </ResultsGrid>

                <Pagination />
              </Stack>
            </Stack>

            <DownloadButton />

            <ShareButton />
          </>
        ) : (
          <Paper
            elevation={0}
            sx={{
              bgcolor: "colors.lightRed",
              p: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {t("noResults")}
            </Typography>
          </Paper>
        )}
      </ResultsPageShell>
    );
  } catch (err) {
    return err instanceof CustomError ? (
      <ResultsPageShell
        queryString={queryString}
        resultsCount={0}
        errorInfo={err.info}
      />
    ) : null;
  }
};

export default ResultsPage;
