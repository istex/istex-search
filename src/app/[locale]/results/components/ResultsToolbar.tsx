"use client";

import { type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import TableRowsIcon from "@mui/icons-material/TableRows";
import WindowIcon from "@mui/icons-material/Window";
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import PerPage from "./PerPage";
import Sorting from "./Sorting";
import type { ClientComponent } from "@/types/next";

const ResultsToolbar: ClientComponent<{
  columns: number;
  setColumns: (columns: number) => void;
}> = ({ columns, setColumns }) => {
  const t = useTranslations("results.ResultsGrid");

  const handleLayout = (_: MouseEvent, newColumns: number | null) => {
    if (newColumns != null) {
      setColumns(newColumns);
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      borderBottom="1px solid"
      borderTop="1px solid"
      borderColor="colors.lightGrey"
      mt={1}
    >
      <Stack direction="row" spacing={1}>
        <PerPage
          fontSize="0.6875rem"
          labelColor="colors.grey"
          selectColor="colors.darkBlack"
        />
        <Sorting
          isLabelLowerCase
          fontSize="0.6875rem"
          labelColor="colors.grey"
          selectColor="colors.darkBlack"
        />
      </Stack>
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

export default ResultsToolbar;
