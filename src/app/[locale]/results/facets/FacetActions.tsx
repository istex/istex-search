"use client";

import { useTranslations } from "next-intl";
import ClearIcon from "@mui/icons-material/Clear";
import { Stack } from "@mui/material";
import { useFacetContext } from "./FacetContext";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

const FacetActions: ClientComponent<{ facetTitle: string }> = ({
  facetTitle,
}) => {
  const t = useTranslations("results.Facets");

  const { facetsList, clearOneFacet, applyOneFacet } = useFacetContext();

  const isApplyDisabled =
    facetsList == null ||
    facetsList[facetTitle].every((facetItem) => !facetItem.selected);

  return (
    <Stack direction="row" spacing={1} mt={1}>
      <Button
        size="medium"
        variant="outlined"
        sx={{
          flexGrow: 1,
        }}
        onClick={() => {
          applyOneFacet(facetTitle);
        }}
        disabled={isApplyDisabled}
      >
        {t("apply")}
      </Button>
      <Button
        size="medium"
        variant="outlined"
        mainColor="grey"
        aria-label={t("clear")}
        title={t("clear")}
        sx={{
          minWidth: "unset",
          p: 0.5,
        }}
        onClick={() => {
          clearOneFacet(facetTitle);
        }}
      >
        <ClearIcon />
      </Button>
    </Stack>
  );
};

export default FacetActions;
