"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import HelpIcon from "@mui/icons-material/Help";
import { Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { darken } from "@mui/system/colorManipulator";
import ClearFilterIcon from "./ClearFilterIcon";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const Filters: ClientComponent = () => {
  const t = useTranslations("results.filters");
  const tRefBibsNative = useTranslations(
    "results.Facets.qualityIndicators.refBibsNative",
  );
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

  const handleToggleExcluded = (filterKey: string, filterValue: string) => {
    const newFilters = { ...filters };
    newFilters[filterKey] = newFilters[filterKey].map((value) => {
      if (value === filterValue && value.startsWith("!")) {
        value = value.slice(1);
      }
      if (value === filterValue && !value.startsWith("!")) {
        value = `!${value}`;
      }
      return value;
    });
    searchParams.setFilters(newFilters);
    searchParams.setPage(1);
    router.push(`/results?${searchParams.toString()}`);
  };

  if (Object.keys(filters).length === 0) {
    return null;
  }

  const getFilterLabel = (filterKey: string, filterValue: string) => {
    if (filterValue.startsWith("!")) {
      return (
        <>
          <Typography
            component="span"
            sx={{
              fontSize: "inherit",
              fontWeight: 700,
              color: "colors.red",
            }}
          >
            NOT
          </Typography>
          {filterKey === "qualityIndicators.refBibsNative"
            ? tRefBibsNative(filterValue.slice(1))
            : filterValue.slice(1)}
        </>
      );
    }
    if (filterKey === "qualityIndicators.refBibsNative") {
      return tRefBibsNative(filterValue);
    }
    return filterValue;
  };

  const getClearIconLabel = (filterKey: string, filterValue: string) => {
    if (filterValue.startsWith("!")) {
      return `NOT ${
        filterKey === "qualityIndicators.refBibsNative"
          ? tRefBibsNative(filterValue.slice(1))
          : filterValue.slice(1)
      }`;
    }
    if (filterKey === "qualityIndicators.refBibsNative") {
      return tRefBibsNative(filterValue);
    }
    return filterValue;
  };

  return (
    <Stack spacing={0.625}>
      <Stack direction="row" alignItems="center">
        <Typography
          variant="body2"
          sx={{
            color: "primary.main",
            fontSize: "0.6875rem",
          }}
        >
          {t("title")}
        </Typography>
        <Tooltip
          title={t("tooltip")}
          placement="right"
          arrow
          componentsProps={{
            popper: {
              sx: {
                "& .MuiTooltip-tooltip": {
                  backgroundColor: "primary.main",
                  color: "colors.white",
                  fontSize: "0.6875rem",
                },
                "& .MuiTooltip-arrow": {
                  color: "primary.main",
                },
              },
            },
          }}
        >
          <IconButton disableRipple size="small" color="primary">
            <HelpIcon
              sx={{
                fontSize: "0.8rem",
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack spacing={0.625} direction="row" flexWrap="wrap" useFlexGap>
        {Object.keys(filters).map((filterKey) =>
          filters[filterKey].map((value) => (
            <Chip
              key={value}
              label={getFilterLabel(filterKey, value)}
              variant="filled"
              size="small"
              onClick={() => {
                handleToggleExcluded(filterKey, value);
              }}
              onDelete={() => {
                handleDelete(filterKey, value);
              }}
              deleteIcon={
                <ClearFilterIcon
                  titleAccess={t("clear", {
                    value: getClearIconLabel(filterKey, value),
                  })}
                />
              }
              sx={{
                borderRadius: "5px",
                backgroundColor: value.startsWith("!")
                  ? darken(theme.palette.colors.white, 0.15)
                  : theme.palette.colors.white,
                color: "colors.darkBlack",
                px: 1.25,
                py: 0.625,
                gap: 0.625,
                "& .MuiChip-label": {
                  p: 0,
                  fontSize: "0.75rem",
                  display: "flex",
                  gap: 0.625,
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
