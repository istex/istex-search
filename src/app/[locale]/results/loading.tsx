"use client";

import { Box, Skeleton, Stack } from "@mui/material";
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
        <Box flexGrow={1}>
          <ResultsGrid>
            {Array(MIN_PER_PAGE)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width="100%"
                  height="18rem"
                  sx={{ borderRadius: "4px" }}
                />
              ))}
          </ResultsGrid>
        </Box>
      </Stack>
    </ResultsPageShell>
  );
};

export default Loading;
