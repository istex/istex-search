"use client";

import { useState } from "react";
import { Box, Stack } from "@mui/material";
import DocumentDetail from "../Document/DocumentDetail";
import Filters from "../Filters/Filters";
import CompatibilityPanelContent from "../Panel/CompatibilityPanelContent";
import IndicatorPanelContent from "../Panel/IndicatorPanelContent";
import Panel from "../Panel/Panel";
import ResultsToolbar from "./ResultsToolbar";
import type { Aggregation } from "@/lib/istexApi";
import type { ClientComponent } from "@/types/next";

const ResultsGrid: ClientComponent<
  { indicators?: Aggregation; compatibility?: Aggregation },
  true
> = ({ indicators, compatibility, children }) => {
  const [columns, setColumns] = useState(2);

  return (
    <Stack gap={1}>
      <Panel title="indicators">
        <IndicatorPanelContent indicators={indicators} />
      </Panel>
      <Panel title="compatibility" open={false}>
        <CompatibilityPanelContent compatibility={compatibility} />
      </Panel>

      <Filters />

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
    </Stack>
  );
};

export default ResultsGrid;
