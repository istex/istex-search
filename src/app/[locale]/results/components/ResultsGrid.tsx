"use client";

import * as React from "react";
import { Box } from "@mui/material";
import DocumentDetail from "./Document/DocumentDetail";
import ResultsToolbar from "./ResultsToolbar";

interface ResultsGridProps {
  children: React.ReactNode;
}

export default function ResultsGrid({ children }: ResultsGridProps) {
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
        {children}
      </Box>

      <DocumentDetail />
    </>
  );
}
