"use client";

import { Skeleton, Stack } from "@mui/material";
import ResultsGrid from "./components/ResultsGrid";
import ResultsPageShell from "./components/ResultsPageShell";
import { MIN_PER_PAGE } from "@/config";
import type { ClientComponent } from "@/types/next";

const Loading: ClientComponent = () => {
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
        alignItems="start"
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

        <Stack spacing={1} useFlexGap flexGrow={1}>
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

          {/* Results */}
          <ResultsGrid>
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
          </ResultsGrid>

          {/* Pagination */}
          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: 1, my: 7.5, height: "2.5rem" }}
          />
        </Stack>
      </Stack>
    </ResultsPageShell>
  );
};

export default Loading;
