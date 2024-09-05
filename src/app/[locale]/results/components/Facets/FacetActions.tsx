import { useTranslations } from "next-intl";
import ClearIcon from "@mui/icons-material/Clear";
import { Stack } from "@mui/material";
import { useFacetContext } from "./FacetContext";
import Button from "@/components/Button";
import { useSearchParams } from "@/lib/hooks";

interface FacetActionsProps {
  facetTitle: string;
  disabled?: boolean;
}

export default function FacetActions({
  facetTitle,
  disabled,
}: FacetActionsProps) {
  const t = useTranslations("results.Facets");
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();

  const { clearOneFacet, applyOneFacet, facetsWaitingForApply } =
    useFacetContext();

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        mt: 1,
      }}
    >
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
        disabled={!Object.keys(filters).includes(facetTitle) || disabled}
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
}
