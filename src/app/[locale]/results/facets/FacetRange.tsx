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

  let min: string = withDecimal
    ? facetItems[0].key.toString().split("-")[0]
    : facetItems[0].key.toString().split("-")[0].split(".")[0];
  let max = withDecimal
    ? facetItems[0].key.toString().split("-")[1]
    : facetItems[0].key.toString().split("-")[1].split(".")[0];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isMin: boolean,
  ) => {
    if (
      // Bridle the score input to the range
      ((facetTitle === "qualityIndicators.score" &&
        +event.target.value >= 0 &&
        +event.target.value <= 10) ||
        facetTitle !== "qualityIndicators.score") &&
      // Accept empty string
      ((!withDecimal && event.target.value === "") ||
        // Accept entire number (5)
        (!withDecimal &&
          !isNaN(parseInt(event.target.value)) &&
          /^[\d.]+$/.test(event.target.value)) ||
        // Accept decimal number (5.3)
        (withDecimal && !isNaN(+event.target.value)) ||
        // Accept decimal number being written (5.)
        (withDecimal &&
          !isNaN(parseInt(event.target.value.slice(0, -1))) &&
          event.target.value.slice(-1) === "." &&
          Number.isInteger(event.target.value.slice(0, -1))))
    ) {
      if (isMin) {
        min = event.target.value;
      } else {
        max = event.target.value;
      }
      setRangeFacet(facetTitle, `${min}-${max}`);
    }
  };

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
        {t("inputLabel", { min, max })}
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
            handleChange(event, true);
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
            handleChange(event, false);
          }}
        />
      </Stack>
    </Box>
  );
};

export default FacetRange;
