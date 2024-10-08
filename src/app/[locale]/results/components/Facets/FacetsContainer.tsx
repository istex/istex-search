"use client";

import { useTranslations } from "next-intl";
import DeleteIcon from "@mui/icons-material/Delete";
import { Stack } from "@mui/material";
import { type FacetList, useFacetContext } from "./FacetContext";
import FacetLayout from "./FacetLayout";
import { FACETS } from "./constants";
import Button from "@/components/Button";
import { useSearchParams } from "@/lib/hooks";

export default function FacetsContainer() {
  const t = useTranslations("results.Facets");
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const isImportSearchMode = searchParams.getSearchMode() === "import";
  const { facetsList, clearAllFacets } = useFacetContext();

  if (facetsList == null) {
    return null;
  }

  const sortFacets = () => {
    const notSortedFacets = { ...facetsList };
    const sortedFacets: FacetList = {};

    FACETS.forEach((facet) => {
      if (notSortedFacets[facet.name] != null) {
        sortedFacets[facet.name] = notSortedFacets[facet.name];
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete notSortedFacets[facet.name];
      }
    });
    // add remaining facets
    Object.keys(notSortedFacets).forEach((key) => {
      sortedFacets[key] = notSortedFacets[key];
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete notSortedFacets[key];
    });

    return sortedFacets;
  };

  return (
    <Stack
      spacing={1}
      sx={{
        bgcolor: "common.white",
        width: { xs: "100%", md: 370 },
        flexShrink: 0,
        borderRadius: 1,
        pb: 1,
        px: 1,
      }}
    >
      {Object.keys(sortFacets()).map((facetTitle) => (
        <FacetLayout
          key={facetTitle}
          facetTitle={facetTitle}
          facetItems={facetsList[facetTitle] ?? []}
          disabled={isImportSearchMode}
        />
      ))}
      <Button
        startIcon={<DeleteIcon />}
        size="medium"
        disabled={Object.keys(filters).length === 0 || isImportSearchMode}
        onClick={clearAllFacets}
        sx={{
          alignSelf: "center",
        }}
      >
        {t("deleteAll")}
      </Button>
    </Stack>
  );
}
