"use client";

import { useState, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import TableRowsIcon from "@mui/icons-material/TableRows";
import WindowIcon from "@mui/icons-material/Window";
import { Box, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import DocumentDetail from "../Document/DocumentDetail";
import Filters from "../Filters/Filters";
import CompatibilityPanelContent from "../Panel/CompatibilityPanelContent";
import IndicatorPanelContent from "../Panel/IndicatorPanelContent";
import Panel from "../Panel/Panel";
import type { Aggregation } from "@/lib/istexApi";
import type { ClientComponent } from "@/types/next";

const ResultsGrid: ClientComponent<
  { indicators?: Aggregation; compatibility?: Aggregation },
  true
> = ({ indicators, compatibility, children }) => {
  const t = useTranslations("results.ResultsGrid");
  const [columns, setColumns] = useState(2);

  const handleLayout = (_: MouseEvent, newColumns: number | null) => {
    if (newColumns != null) {
      setColumns(newColumns);
    }
  };

  return (
    <Stack gap={1}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <StyledToggleButtonGroup
          size="small"
          value={columns}
          exclusive
          onChange={handleLayout}
          aria-label={t("layouts.groupAriaLabel")}
          sx={{
            display: { xs: "none", sm: "inline-flex" },
          }}
        >
          <ToggleButton value={2} aria-label={t("layouts.gridAriaLabel")}>
            <WindowIcon />
          </ToggleButton>
          <ToggleButton value={1} aria-label={t("layouts.listAriaLabel")}>
            <TableRowsIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Box>
      {indicators != null && (
        <Panel title="indicators">
          <IndicatorPanelContent indicators={indicators} />
        </Panel>
      )}
      {compatibility != null && (
        <Panel title="compatibility">
          <CompatibilityPanelContent compatibility={compatibility} />
        </Panel>
      )}
      <Filters />
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

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-selected": {
      color: theme.palette.colors.blue,
      backgroundColor: "unset",
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

export default ResultsGrid;
