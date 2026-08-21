import { Box, Skeleton, Stack } from "@mui/material";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import * as React from "react";
import { MIN_PER_PAGE } from "@/config";
import type { IstexApiResponse } from "@/lib/istexApi";
import ResultsPage from "./_page";
import ResultsPageShell from "./components/ResultsPageShell";
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("results.metadata");

  return {
    title: `Istex Search - ${t("title")}`,
  };
}

// We can't rely on the automatic Suspense wrapping provided by Next.js through
// the loading.tsx file because a change in the URLSearchParams only isn't considered an
// actual page change. We have to wrap ResultsPage in Suspense ourselves and make sure it's
// invalidated when the search params change.
// More info: https://github.com/vercel/next.js/issues/46258#issuecomment-1479233189
export default async function _ResultsPage(
  props: PageProps<"/[locale]/results">,
) {
  // We want to trigger the Suspense only when search params that require
  // a new API call are changed
  const searchParams = await props.searchParams;
  const key = JSON.stringify({
    q: searchParams.q,
    q_id: searchParams.q_id,
    page: searchParams.page,
    perPage: searchParams.perPage,
    filters: searchParams.filters,
  });

  return (
    <React.Suspense
      key={key}
      fallback={
        <Loading
          queryString={typeof searchParams.q === "string" ? searchParams.q : ""}
        />
      }
    >
      <ResultsPage {...props} />
    </React.Suspense>
  );
}

interface LoadingProps {
  queryString: string;
}

function Loading({ queryString }: LoadingProps) {
  const emptyResults: IstexApiResponse = {
    total: 0,
    hits: [],
    aggregations: {},
  };

  return (
    <ResultsPageShell queryString={queryString} results={emptyResults} loading>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        {/* Filters */}
        <Skeleton
          sx={{
            width: { xs: "100%", md: "21.5rem" },
            height: "auto",
            flexShrink: 0,
          }}
        />

        <Stack
          spacing={1}
          useFlexGap
          sx={{
            width: "100%",
          }}
        >
          {/* Indicators */}
          <Stack spacing={1}>
            <Skeleton sx={{ height: "14.5rem" }} />
            <Skeleton sx={{ height: "3rem" }} />
          </Stack>

          {/* Results toolbar */}
          <Skeleton sx={{ mt: 1, height: "3rem" }} />

          {/* Results */}
          <Box
            id="results-grid"
            sx={{
              my: 1,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            {Array(MIN_PER_PAGE)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  sx={{
                    borderRadius: 1,
                    height: "18rem",
                  }}
                />
              ))}
          </Box>

          {/* Pagination */}
          <Skeleton sx={{ my: 7.5, height: "2.5rem" }} />
        </Stack>
      </Stack>
    </ResultsPageShell>
  );
}
