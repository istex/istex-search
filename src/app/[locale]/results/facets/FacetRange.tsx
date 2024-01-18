"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { useFacetContext } from "./FacetContext";
import type { FacetLayoutProps } from "./FacetLayout";
import { FACETS_RANGE_WITH_DECIMAL, checkRangeInputValue } from "./utils";
import type { ClientComponent } from "@/types/next";

const FacetRange: ClientComponent<FacetLayoutProps> = ({
  facetTitle,
  facetItems,
}) => {
  const { setRangeFacet } = useFacetContext();
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

  useEffect(() => {
    if (min !== initialMin || max !== initialMax) {
      setRangeFacet(facetTitle, `${min}-${max}`);
    }
  }, [min, max, initialMin, initialMax, facetTitle, setRangeFacet]);

  return (
    <Box sx={{ m: 2 }}>
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
      <Stack direction="row" alignItems="center" spacing={2}>
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
      </Stack>
    </Box>
  );
};

export default FacetRange;
