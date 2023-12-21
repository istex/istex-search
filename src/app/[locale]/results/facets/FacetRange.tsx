"use client";

import { useTranslations } from "next-intl";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { useFacetContext } from "./FacetContext";
import type { FacetLayoutProps } from "./FacetLayout";
import type { ClientComponent } from "@/types/next";

const FacetRange: ClientComponent<FacetLayoutProps> = ({
  facetTitle,
  facetItems,
}) => {
  const { setRangeFacet } = useFacetContext();
  const t = useTranslations(`results.Facets.${facetTitle}`);

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
          min: facetItems[0].fromAsString,
          max: facetItems[0].toAsString,
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
          value={facetItems[0].key.split("-")[0]}
          onChange={(event) => {
            setRangeFacet(
              `${event.target.value}-${facetItems[0].key.split("-")[1]}`,
            );
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
          value={facetItems[0].key.split("-")[1]}
          onChange={(event) => {
            setRangeFacet(
              `${facetItems[0].key.split("-")[0]}-${event.target.value}`,
            );
          }}
        />
      </Stack>
    </Box>
  );
};

export default FacetRange;
