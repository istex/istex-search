"use client";

import { useTranslations } from "next-intl";
import ClearIcon from "@mui/icons-material/Clear";
import { Stack } from "@mui/material";
import { useFacetContext } from "./FacetContext";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

interface FacetActionsProps {
  facetTitle: string;
  disabled?: boolean;
}

const FacetActions: ClientComponent<FacetActionsProps> = ({
  facetTitle,
  disabled,
}) => {
  const t = useTranslations("results.Facets");

  const { clearOneFacet, applyOneFacet, facetsWaitingForApply } =
    useFacetContext();

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
        disabled={!facetsWaitingForApply.includes(facetTitle) || disabled}
      >
        {t("apply")}
      </Button>
      <Button
        size="medium"
        variant="outlined"
        mainColor="grey"
        aria-label={t("clear")}
        title={t("clear")}
        disabled={disabled}
        onClick={() => {
          clearOneFacet(facetTitle);
        }}
        sx={{
          minWidth: "unset",
          p: 0.5,
        }}
      >
        <ClearIcon />
      </Button>
    </Stack>
  );
};

export default FacetActions;
