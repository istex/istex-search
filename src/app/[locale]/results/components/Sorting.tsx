"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  type SelectChangeEvent,
} from "@mui/material";
import { rankValues, sortFields, type SortBy } from "@/config";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "@/lib/hooks";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const history = useHistoryContext();
  const sortBy = searchParams.getSortBy();
  const sortDirection = searchParams.getSortDirection();
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
    searchParams.setSortBy(event.target.value as SortBy);

    history.populateCurrentRequest({
      date: Date.now(),
      searchParams,
    });

    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  const toggleSortDirection = () => {
    searchParams.setSortDirection(sortDirection === "asc" ? "desc" : "asc");

    history.populateCurrentRequest({
      date: Date.now(),
      searchParams,
    });

    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
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
