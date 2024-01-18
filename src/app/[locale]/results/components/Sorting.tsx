"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { rankValues, sortFields, type SortBy } from "@/config";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const Sorting: ClientComponent<{
  isLabelLowerCase?: boolean;
  fontSize: string;
  labelColor: string;
  selectColor: string;
  enableLoading?: boolean;
}> = ({
  isLabelLowerCase,
  fontSize,
  labelColor,
  selectColor,
  enableLoading,
}) => {
  const t = useTranslations("results.ResultsGrid");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortBy = searchParams.getSortBy();
  const sortDirection = searchParams.getSortDirection();

  const [selectMinWidth, setSelectMinWidth] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, [sortBy, sortDirection]);

  const menuCallbackRef = useCallback(
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
    if (enableLoading === true) {
      setLoading(true);
    }
    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  const toggleSortDirection = () => {
    searchParams.setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    if (enableLoading === true) {
      setLoading(true);
    }
    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="body2" sx={{ fontSize, color: labelColor }}>
        {isLabelLowerCase === true
          ? t("sorting.sortBy").toLowerCase()
          : t("sorting.sortBy")}
      </Typography>
      <Select
        autoWidth
        disabled={loading}
        variant="standard"
        value={sortBy}
        onChange={handleSortByChange}
        MenuProps={{
          keepMounted: true,
          slotProps: { paper: { ref: menuCallbackRef } },
        }}
        sx={{
          minWidth: selectMinWidth === null ? "unset" : selectMinWidth,
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
            {t(`sorting.${value}`)}
          </MenuItem>
        ))}
      </Select>
      {(sortBy === "publicationDate" || sortBy === "title.raw") && (
        <IconButton
          onClick={toggleSortDirection}
          title={t(`sorting.${sortDirection}`)}
          aria-label={t(`sorting.${sortDirection}`)}
          disabled={loading}
        >
          <ArrowDownwardIcon
            sx={{
              color: loading ? "colors.lightGrey" : selectColor,
              fontSize: "1rem",
              transform:
                sortDirection === "desc" ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </IconButton>
      )}
      {loading && <CircularProgress size={20} />}
    </Stack>
  );
};

export default Sorting;
