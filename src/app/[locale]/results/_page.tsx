import { getTranslator, redirect } from "next-intl/server";
import { Box, Paper, Stack, Typography } from "@mui/material";
import DownloadButton from "./components/DownloadButton";
import Pagination from "./components/Pagination";
import ResultCard from "./components/ResultCard";
import ResultsGrid from "./components/ResultsGrid";
import ResultsPageShell from "./components/ResultsPageShell";
import type { FacetList } from "./facets/FacetContext";
import FacetsContainer from "./facets/FacetsContainer";
import {
  COMPATIBILITY_FACETS,
  FACETS,
  INDICATORS_FACETS,
} from "./facets/constants";
import ErrorCard from "@/components/ErrorCard";
import type { PerPageOption } from "@/config";
import CustomError from "@/lib/CustomError";
import {
  getResults,
  type Aggregation,
  type IstexApiResponse,
} from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import type { Page } from "@/types/next";

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

const ResultsPage: Page = async ({
  params: { locale },
  searchParams: nextSearchParams,
}) => {
  const searchParams = useSearchParams(nextSearchParams);
  const page = searchParams.getPage();
  const perPage = searchParams.getPerPage();
  const t = await getTranslator(locale, "results");

  let queryString: string;
  try {
    queryString = await searchParams.getQueryString();
  } catch (err) {
    return err instanceof CustomError ? (
      <ResultsPageShell queryString="" resultsCount={0}>
        <ErrorCard {...err.info} />
      </ResultsPageShell>
    ) : null;
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

    const facets: FacetList = {};
    const indicators: Aggregation = {};
    const compatibility: Aggregation = {};
    for (const facetTitle in results.aggregations) {
      if (FACETS.some((facet) => facet.name === facetTitle)) {
        facets[facetTitle] = results.aggregations[facetTitle].buckets;
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
              <Box flexGrow={1}>
                <ResultsGrid
                  indicators={indicators}
                  compatibility={compatibility}
                >
                  {results.hits.map((result) => (
                    <ResultCard key={result.id} info={result} />
                  ))}
                </ResultsGrid>

                <Pagination />
              </Box>
            </Stack>
            <DownloadButton />
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
      <ResultsPageShell queryString={queryString} resultsCount={0}>
        <ErrorCard {...err.info} />
      </ResultsPageShell>
    ) : null;
  }
};

export default ResultsPage;
