"use client";

import { Box, Skeleton, Stack } from "@mui/material";
import ResultsPageShell from "./components/ResultsPageShell";
import { MIN_PER_PAGE } from "@/config";

export default function Loading() {
  let lastSavedQueryString = "";
  if (typeof window !== "undefined") {
    lastSavedQueryString = localStorage.getItem("lastQueryString") ?? "";
  }

  return (
    <ResultsPageShell
      queryString={lastSavedQueryString}
      resultsCount={0}
      loading
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{
          alignItems: "start",
        }}
      >
        {/* Facets */}
        <Skeleton
          variant="rectangular"
          sx={{
            borderRadius: 1,
            width: { xs: "100%", md: 370 },
            height: "auto",
            alignSelf: "stretch",
            flexShrink: 0,
          }}
        />

        <Stack
          spacing={1}
          useFlexGap
          sx={{
            flexGrow: 1,
          }}
        >
          {/* Indicators */}
          <Stack spacing={1}>
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 1, height: "13.5rem" }}
            />
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: 1, height: "3rem" }}
            />
          </Stack>

          {/* Results toolbar */}
          <Skeleton
            variant="rectangular"
            sx={{ mt: 1, borderRadius: 1, height: "3rem" }}
          />

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
                  variant="rectangular"
                  sx={{
                    borderRadius: 1,
                    height: "18rem",
                  }}
                />
              ))}
          </Box>

          {/* Pagination */}
          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: 1, my: 7.5, height: "2.5rem" }}
          />
        </Stack>
      </Stack>
    </ResultsPageShell>
  );
}
