"use client";

import * as React from "react";
import { Box } from "@mui/material";
import DocumentDetail from "./Document/DocumentDetail";
import ResultCard from "./ResultCard";
import ResultsToolbar from "./ResultsToolbar";
import type { Result } from "@/lib/istexApi";

interface ResultsGridProps {
  results: Result[];
}

export default function ResultsGrid({ results }: ResultsGridProps) {
  const [columns, setColumns] = React.useState(2);

  return (
    <>
      <ResultsToolbar columns={columns} setColumns={setColumns} />

      <Box
        id="results-grid"
        sx={{
          my: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: `repeat(${columns}, 1fr)` },
          gap: 2,
        }}
      >
        {results.map((result) => (
          <ResultCard
            key={result.id}
            info={result}
            displayIcons={columns === 1}
          />
        ))}
      </Box>

      <DocumentDetail />
    </>
  );
}
