"use client";

import { Box, Skeleton, Stack } from "@mui/material";
import ResultsPageShell from "./components/ResultsPageShell";
import { MIN_PER_PAGE } from "@/config";
import type { IstexApiResponse } from "@/lib/istexApi";

export default function Loading() {
  let lastSavedQueryString = "";
  if (typeof window !== "undefined") {
    lastSavedQueryString = localStorage.getItem("lastQueryString") ?? "";
  }

  const emptyResults: IstexApiResponse = {
    total: 0,
    hits: [],
    aggregations: {},
  };

  return (
    <ResultsPageShell
      queryString={lastSavedQueryString}
      results={emptyResults}
      loading
    >
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
