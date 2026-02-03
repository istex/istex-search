"use client";

import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { useQueryContext } from "@/contexts/QueryContext";
import DocumentDetail from "./Document/DocumentDetail";
import ResultCard from "./ResultCard";
import ResultsToolbar from "./ResultsToolbar";

const COLUMN_COUNT_KEY = "columnState";
const DEFAULT_COLUMN_COUNT = 2;

export default function ResultGrid() {
  const { results } = useQueryContext();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("sm"));
  const [columnCount, setColumnCount] = React.useState(DEFAULT_COLUMN_COUNT);

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
        {results.hits.map((hit, i) => (
          <ResultCard
            key={hit.id}
            index={i}
            displayIcons={columnCount === 1 && !xs}
          />
        ))}
      </Box>

      <DocumentDetail />
    </>
  );
}
