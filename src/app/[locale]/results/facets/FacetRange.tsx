"use client";

import { useTranslations } from "next-intl";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { useFacetContext } from "./FacetContext";
import type { FacetLayoutProps } from "./FacetLayout";
import type { ClientComponent } from "@/types/next";

const FACETS_RANGE_WITH_DECIMAL = ["qualityIndicators.score"];

const FacetRange: ClientComponent<FacetLayoutProps> = ({
  facetTitle,
  facetItems,
}) => {
  const { setRangeFacet } = useFacetContext();
  const t = useTranslations(`results.Facets.${facetTitle}`);

  const withDecimal = FACETS_RANGE_WITH_DECIMAL.includes(facetTitle);

  let min = withDecimal
    ? facetItems[0].key.split("-")[0]
    : parseInt(facetItems[0].key.split("-")[0]);
  let max = withDecimal
    ? facetItems[0].key.split("-")[1]
    : parseInt(facetItems[0].key.split("-")[1]);

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
        {t("inputLabel", {
          min:
            facetItems[0].fromAsString === undefined
              ? facetItems[0].from
              : facetItems[0].fromAsString,
          max:
            facetItems[0].toAsString === undefined
              ? facetItems[0].to
              : facetItems[0].toAsString,
        })}
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
          onChange={(event) => {
            if (withDecimal) {
              min = event.target.value;
              setRangeFacet(facetTitle, `${min}-${max}`);
            } else {
              if (!isNaN(parseInt(event.target.value))) {
                min = parseInt(event.target.value);
                setRangeFacet(facetTitle, `${min}-${max}`);
              }
            }
          }}
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
          onChange={(event) => {
            if (withDecimal) {
              max = event.target.value;
              setRangeFacet(facetTitle, `${min}-${max}`);
            } else {
              if (!isNaN(parseInt(event.target.value))) {
                max = parseInt(event.target.value);
                setRangeFacet(facetTitle, `${min}-${max}`);
              }
            }
          }}
        />
      </Stack>
    </Box>
  );
};

export default FacetRange;
