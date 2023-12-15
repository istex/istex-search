"use client";

import { useTranslations } from "next-intl";
import DeleteIcon from "@mui/icons-material/Delete";
import { Stack } from "@mui/material";
import { useFacetContext } from "./FacetContext";
import FacetLayout from "./FacetLayout";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

const FacetsContainer: ClientComponent = () => {
  const t = useTranslations("results.Facets");

  const { facetsList, clearAllFacets } = useFacetContext();

  if (facetsList == null) {
    return null;
  }

  return (
    <Stack
      bgcolor="common.white"
      width={{ xs: "100%", md: 370 }}
      flexShrink={0}
      borderRadius={1}
      pb={1}
      px={1}
      spacing={1}
    >
      {Object.keys(facetsList).map((facetTitle) => (
        <FacetLayout
          key={facetTitle}
          facetTitle={facetTitle}
          facetItems={facetsList[facetTitle]}
        />
      ))}
      <Button
        startIcon={<DeleteIcon />}
        size="medium"
        sx={{
          alignSelf: "center",
        }}
        onClick={clearAllFacets}
      >
        {t("deleteAll")}
      </Button>
    </Stack>
  );
};

export default FacetsContainer;
