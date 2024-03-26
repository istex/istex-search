"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import DocumentDetail from "../Document/DocumentDetail";
import ResultsToolbar from "./ResultsToolbar";
import type { ClientComponent } from "@/types/next";

const ResultsGrid: ClientComponent<{}, true> = ({ children }) => {
  const [columns, setColumns] = useState(2);

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
};

export default ResultsGrid;
