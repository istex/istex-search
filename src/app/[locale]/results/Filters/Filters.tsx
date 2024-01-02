"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { Chip, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ClearFilterIcon from "./ClearFilterIcon";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const Filters: ClientComponent = () => {
  const t = useTranslations("results.filters");
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const theme = useTheme();

  const handleDelete = (filterKey: string, filterValue: string) => {
    let newFilters = { ...filters };
    newFilters[filterKey] = newFilters[filterKey].filter(
      (value) => value !== filterValue,
    );
    if (newFilters[filterKey].length === 0) {
      const { [filterKey]: _, ...updatedFilters } = newFilters;
      newFilters = updatedFilters;
    }
    searchParams.setFilters(newFilters);
    searchParams.setPage(1);
    searchParams.setLastAppliedFacet(filterKey);
    router.push(`/results?${searchParams.toString()}`);
  };

  if (Object.keys(filters).length === 0) {
    return null;
  }

  return (
    <Stack spacing={0.625}>
      <Typography
        variant="body2"
        sx={{
          color: "colors.blue",
          fontSize: "0.6875rem",
        }}
      >
        {t("title")}
      </Typography>
      <Stack spacing={0.625} direction="row" flexWrap="wrap" useFlexGap>
        {Object.keys(filters).map((filterKey) =>
          filters[filterKey].map((value) => (
            <Chip
              key={value}
              label={value}
              variant="filled"
              size="small"
              onDelete={() => {
                handleDelete(filterKey, value);
              }}
              deleteIcon={
                <ClearFilterIcon titleAccess={t("clear", { value })} />
              }
              sx={{
                borderRadius: "5px",
                backgroundColor: "colors.white",
                color: "colors.darkBlack",
                px: 1.25,
                py: 0.625,
                gap: 0.625,
                "& .MuiChip-label": {
                  p: 0,
                  fontSize: "0.75rem",
                },
                "& .MuiChip-deleteIcon": {
                  m: 0,
                  color: theme.palette.colors.grey,
                  fill: theme.palette.colors.veryLightBlue,
                },
              }}
            />
          )),
        )}
      </Stack>
    </Stack>
  );
};

export default Filters;
