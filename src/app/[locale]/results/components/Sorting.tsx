import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import * as React from "react";
import { rankValues, type SortBy, sortFields } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import { useSortBy, useSortDirection } from "@/lib/searchParams";

interface SortingProps {
  isLabelLowerCase?: boolean;
  fontSize: string;
  labelColor: string;
  selectColor: string;
  disabled?: boolean;
}

export default function Sorting({
  isLabelLowerCase,
  fontSize,
  labelColor,
  selectColor,
  disabled,
}: SortingProps) {
  const t = useTranslations("results.Sorting");
  const tResults = useTranslations("results");
  const [sortBy, setSortBy] = useSortBy();
  const [sortDirection, setSortDirection] = useSortDirection();
  const { loading } = useQueryContext();
  const [selectMinWidth, setSelectMinWidth] = React.useState<number | null>(
    null,
  );

  const menuCallbackRef = React.useCallback(
    (menuDiv: HTMLDivElement | null) => {
      if (menuDiv !== null) {
        if (selectMinWidth === null || selectMinWidth !== menuDiv.clientWidth) {
          setSelectMinWidth(menuDiv.clientWidth);
        }
      }
    },
    [selectMinWidth],
  );

  const handleSortByChange = (event: SelectChangeEvent<SortBy>) => {
    setSortBy(event.target.value, { shallow: false, history: "push" });
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc", {
      shallow: false,
      history: "push",
    });
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
      }}
    >
      <InputLabel id="sorting-label" sx={{ fontSize, color: labelColor }}>
        {isLabelLowerCase === true ? t("sortBy").toLowerCase() : t("sortBy")}
      </InputLabel>
      <Select
        id="sorting-select"
        labelId="sorting-label"
        autoWidth
        disabled={loading === true || disabled === true}
        title={disabled === true ? tResults("unavailableTitle") : ""}
        variant="standard"
        value={sortBy}
        onChange={handleSortByChange}
        MenuProps={{
          keepMounted: true,
          slotProps: { paper: { ref: menuCallbackRef } },
        }}
        sx={{
          minWidth: selectMinWidth ?? "unset",
          fontSize,
          color: selectColor,
          fontWeight: 700,
          "&:before": {
            borderBottom: "none",
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottom: "none",
          },
          "&.Mui-disabled:before": {
            borderBottom: "none",
          },
          "&:after": {
            borderBottom: "none",
          },
          "& .MuiSelect-select:focus": {
            backgroundColor: "unset",
          },
        }}
      >
        {[...rankValues, ...sortFields].map((value) => (
          <MenuItem key={value} value={value} sx={{ fontSize }}>
            {t(value)}
          </MenuItem>
        ))}
      </Select>
      {(sortBy === "publicationDate" || sortBy === "title.raw") && (
        <IconButton
          onClick={toggleSortDirection}
          title={t(sortDirection)}
          aria-label={t(sortDirection)}
          disabled={loading}
        >
          <ArrowDownwardIcon
            sx={{
              color: loading === true ? "colors.lightGrey" : selectColor,
              fontSize: "1rem",
              transform:
                sortDirection === "desc" ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </IconButton>
      )}
    </Stack>
  );
}
