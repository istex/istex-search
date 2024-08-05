"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Box, Stack, Typography } from "@mui/material";
import { useFacetContext } from "./FacetContext";
import type { FacetLayoutProps } from "./FacetLayout";
import { FACETS_RANGE_WITH_DECIMAL } from "./utils";
import NumberInput from "@/components/NumberInput";
import Selector from "@/components/Selector";
import { useSearchParams } from "@/lib/hooks";

export const RANGE_FACETS_WITH_TOGGLE = ["publicationDate"];
const RANGE_OPTIONS = ["range", "single"] as const;
type RangeOption = (typeof RANGE_OPTIONS)[number];

export default function FacetRange({
  facetTitle,
  facetItems,
  disabled,
}: FacetLayoutProps) {
  const locale = useLocale();
  const { setRangeFacet } = useFacetContext();
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const t = useTranslations(`results.Facets.${facetTitle}`);
  const tResults = useTranslations("results");

  const withDecimal = FACETS_RANGE_WITH_DECIMAL.includes(facetTitle);

  const facetItem = facetItems[0];
  const [minValue, maxValue] = facetItem.key
    .toString()
    .split("-")
    .map((v) => (!Number.isNaN(Number(v)) ? Number(v) : null));
  const minIntegerPart = minValue != null ? Math.floor(minValue) : null;
  const maxIntegerPart = maxValue != null ? Math.floor(maxValue) : null;
  const initialMin = withDecimal ? minValue : minIntegerPart;
  const initialMax = withDecimal ? maxValue : maxIntegerPart;

  const from = Number(facetItem.fromAsString ?? facetItem.from);
  const to = Number(facetItem.toAsString ?? facetItem.to);
  const minLabel = !Number.isNaN(from) ? from.toLocaleString(locale) : "*";
  const maxLabel = !Number.isNaN(to) ? to.toLocaleString(locale) : "*";

  const [min, setMin] = React.useState(initialMin);

  const [max, setMax] = React.useState(initialMax);

  const withToggle = RANGE_FACETS_WITH_TOGGLE.includes(facetTitle);

  const getInitialSingleValue = () => {
    const filter = filters[facetTitle];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (filter !== undefined) {
      const [filterMin, filterMax] = filter[0].split("-").map(Number);
      return filterMin === filterMax ? filterMin : null;
    }

    if (withDecimal) {
      return minValue === maxValue ? minValue : null;
    }

    return minIntegerPart === maxIntegerPart ? minIntegerPart : null;
  };

  const initialSingleValue = getInitialSingleValue();

  const [rangeOption, setRangeOption] = React.useState<RangeOption>(
    withToggle && initialSingleValue != null ? "single" : "range",
  );
  const [singleValue, setSingleValue] = React.useState(initialSingleValue);

  React.useEffect(() => {
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
    <Stack spacing={1}>
      {withToggle && (
        <Box sx={{ mb: 1 }}>
          <Selector
            options={RANGE_OPTIONS}
            disabled={disabled}
            title={disabled === true ? tResults("unavailableTitle") : ""}
            value={rangeOption}
            t={t}
            onChange={(_, value) => {
              setRangeOption(value as RangeOption);
            }}
          />
        </Box>
      )}
      <Typography
        variant="body2"
        sx={(theme) => ({
          color:
            disabled === true
              ? theme.palette.text.disabled
              : "colors.lightBlack",
          fontSize: "0.8rem",
          mb: 0.5,
        })}
      >
        {t("inputLabel", { minLabel, maxLabel })}
      </Typography>
      {rangeOption === "range" ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <NumberInput
            variant="outlined"
            size="small"
            color="primary"
            focused
            placeholder={t("inputPlaceholderMin")}
            fullWidth
            step={facetTitle === "qualityIndicators.score" ? 0.1 : undefined}
            min={!Number.isNaN(from) ? from : undefined}
            max={!Number.isNaN(to) ? to : undefined}
            value={min}
            onChange={setMin}
            disabled={disabled}
            title={disabled === true ? tResults("unavailableTitle") : ""}
          />
          <Typography
            variant="body2"
            sx={(theme) => ({
              color:
                disabled === true
                  ? theme.palette.text.disabled
                  : "colors.lightBlack",
              fontSize: "0.8rem",
            })}
          >
            {t("to")}
          </Typography>
          <NumberInput
            variant="outlined"
            size="small"
            color="primary"
            focused
            placeholder={t("inputPlaceholderMax")}
            fullWidth
            step={facetTitle === "qualityIndicators.score" ? 0.1 : undefined}
            min={!Number.isNaN(from) ? from : undefined}
            max={!Number.isNaN(to) ? to : undefined}
            value={max}
            onChange={setMax}
            disabled={disabled}
            title={disabled === true ? tResults("unavailableTitle") : ""}
          />
        </Stack>
      ) : (
        <NumberInput
          variant="outlined"
          size="small"
          color="primary"
          focused
          placeholder={t("inputPlaceholderSingle")}
          step={facetTitle === "qualityIndicators.score" ? 0.1 : undefined}
          min={!Number.isNaN(from) ? from : undefined}
          max={!Number.isNaN(to) ? to : undefined}
          value={singleValue}
          onChange={setSingleValue}
          disabled={disabled}
          title={disabled === true ? tResults("unavailableTitle") : ""}
          sx={{ width: "40%" }}
        />
      )}
    </Stack>
  );
}
