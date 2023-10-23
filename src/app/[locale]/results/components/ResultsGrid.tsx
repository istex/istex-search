"use client";

import { type MouseEvent, useState } from "react";
import { useTranslations } from "next-intl";
import TableRowsIcon from "@mui/icons-material/TableRows";
import WindowIcon from "@mui/icons-material/Window";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useResultsContext } from "@/contexts/ResultsContext";
import type { ClientComponent } from "@/types/next";

const ResultsGrid: ClientComponent<{}, true> = ({ children }) => {
  const t = useTranslations("results.ResultsGrid");
  const { resultsCount } = useResultsContext();
  const [columns, setColumns] = useState(2);

  const handleLayout = (_: MouseEvent, newColumns: number | null) => {
    if (newColumns != null) {
      setColumns(newColumns);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2">
            {t.rich("resultsCount", { count: resultsCount })}
          </Typography>
        </Box>

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
    </>
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
