"use client";

import * as React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DocumentDetail from "./Document/DocumentDetail";
import ResultCard from "./ResultCard";
import ResultsToolbar from "./ResultsToolbar";
import type { Result } from "@/lib/istexApi";

interface ResultsGridProps {
  results: Result[];
}

const COLUMN_COUNT_KEY = "columnState";
const DEFAULT_COLUMN_COUNT = 2;

export default function ResultsGrid({ results }: ResultsGridProps) {
  const [columnCount, setColumnCount] = React.useState(DEFAULT_COLUMN_COUNT);
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("sm"));

  const changeColumnCount = (newColumnCount: number) => {
    // The column count is stored in local storage to be persistent across pages
    localStorage.setItem(COLUMN_COUNT_KEY, newColumnCount.toString());

    setColumnCount(newColumnCount);
  };

  React.useEffect(() => {
    const columnCountFromLocalStorage = localStorage.getItem(COLUMN_COUNT_KEY);
    const columnCountFromLocalStorageAsNumber = Number(
      columnCountFromLocalStorage,
    );

    // Initialize the local storage the first time
    if (
      columnCountFromLocalStorage == null ||
      Number.isNaN(columnCountFromLocalStorageAsNumber)
    ) {
      localStorage.setItem(COLUMN_COUNT_KEY, DEFAULT_COLUMN_COUNT.toString());

      return;
    }

    setColumnCount(columnCountFromLocalStorageAsNumber);
  }, []);

  return (
    <>
      <ResultsToolbar columns={columnCount} setColumns={changeColumnCount} />

      <Box
        id="results-grid"
        sx={{
          my: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: `repeat(${columnCount}, 1fr)` },
          gap: 2,
        }}
      >
        {results.map((result) => (
          <ResultCard
            key={result.id}
            info={result}
            displayIcons={columnCount === 1 && !xs}
          />
        ))}
      </Box>

      <DocumentDetail />
    </>
  );
}
