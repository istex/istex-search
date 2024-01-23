"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { useFacetContext } from "./FacetContext";
import type { FacetLayoutProps } from "./FacetLayout";
import { FACETS_RANGE_WITH_DECIMAL, checkRangeInputValue } from "./utils";
import Selector from "@/components/Selector";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

export const RANGE_FACETS_WITH_TOGGLE = ["publicationDate"];
const RANGE_OPTIONS = ["range", "single"] as const;
type RangeOption = (typeof RANGE_OPTIONS)[number];

const FacetRange: ClientComponent<FacetLayoutProps> = ({
  facetTitle,
  facetItems,
}) => {
  const { setRangeFacet } = useFacetContext();
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const t = useTranslations(`results.Facets.${facetTitle}`);

  const withDecimal = FACETS_RANGE_WITH_DECIMAL.includes(facetTitle);

  const initialMin = withDecimal
    ? facetItems[0].key.toString().split("-")[0]
    : facetItems[0].key.toString().split("-")[0].split(".")[0];
  const initialMax = withDecimal
    ? facetItems[0].key.toString().split("-")[1]
    : facetItems[0].key.toString().split("-")[1].split(".")[0];

  const minLabel =
    facetItems[0].fromAsString ?? facetItems[0].from?.toString() ?? "";
  const maxLabel =
    facetItems[0].toAsString ?? facetItems[0].to?.toString() ?? "";

  const [min, setMin] = useState<string>(initialMin);

  const [max, setMax] = useState<string>(initialMax);

  const withToggle = RANGE_FACETS_WITH_TOGGLE.includes(facetTitle);

  const getInitialSingleValue = () => {
    if (filters[facetTitle] !== undefined) {
      return filters[facetTitle][0].split("-")[0] ===
        filters[facetTitle][0].split("-")[1]
        ? filters[facetTitle][0].split("-")[0]
        : "";
    }
    if (withDecimal) {
      return facetItems[0].key.toString().split("-")[0] ===
        facetItems[0].key.toString().split("-")[1]
        ? facetItems[0].key.toString().split("-")[0]
        : "";
    }
    return facetItems[0].key.toString().split("-")[0].split(".")[0] ===
      facetItems[0].key.toString().split("-")[1].split(".")[0]
      ? facetItems[0].key.toString().split("-")[0].split(".")[0]
      : "";
  };

  const initialSingleValue = getInitialSingleValue();

  const [rangeOption, setRangeOption] = useState<RangeOption>(
    withToggle && initialSingleValue !== "" ? "single" : "range",
  );
  const [singleValue, setSingleValue] = useState<string>(initialSingleValue);

  const handleMinChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (checkRangeInputValue(facetTitle, event.target.value)) {
      setMin(event.target.value);
    }
  };

  const handleMaxChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (checkRangeInputValue(facetTitle, event.target.value)) {
      setMax(event.target.value);
    }
  };

  const handleSingleValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (checkRangeInputValue(facetTitle, event.target.value)) {
      setSingleValue(event.target.value);
    }
  };

  useEffect(() => {
    if (rangeOption === "range" && (min !== initialMin || max !== initialMax)) {
      setRangeFacet(facetTitle, `${min}-${max}`);
    }
    if (rangeOption === "single" && singleValue !== initialSingleValue) {
      setRangeFacet(facetTitle, `${singleValue}-${singleValue}`);
    }
  }, [
    min,
    max,
    initialMin,
    initialMax,
    singleValue,
    initialSingleValue,
    rangeOption,
    facetTitle,
    setRangeFacet,
  ]);

  return (
    <Box sx={{ m: 2 }}>
      {withToggle && (
        <Box sx={{ mb: 1 }}>
          <Selector
            value={rangeOption}
            options={RANGE_OPTIONS as unknown as string[]}
            onChange={(_, value) => {
              setRangeOption(value as RangeOption);
            }}
            t={t}
          />
        </Box>
      )}
      <Typography
        variant="body2"
        sx={{
          color: "colors.lightBlack",
          fontSize: "0.8rem",
          mb: 0.5,
        }}
      >
        {t("inputLabel", { minLabel, maxLabel })}
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        {rangeOption === "range" ? (
          <>
            <TextField
              variant="outlined"
              size="small"
              color="primary"
              focused
              placeholder={t("inputPlaceholderMin")}
              fullWidth
              value={min}
              onChange={handleMinChange}
            />
            <Typography
              variant="body2"
              sx={{
                color: "colors.lightBlack",
                fontSize: "0.8rem",
              }}
            >
              {t("to")}
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              color="primary"
              focused
              placeholder={t("inputPlaceholderMax")}
              fullWidth
              value={max}
              onChange={handleMaxChange}
            />
          </>
        ) : (
          <TextField
            variant="outlined"
            size="small"
            color="primary"
            focused
            placeholder={t("inputPlaceholderSingle")}
            sx={{ width: "40%" }}
            value={singleValue}
            onChange={handleSingleValueChange}
          />
        )}
      </Stack>
    </Box>
  );
};

export default FacetRange;
