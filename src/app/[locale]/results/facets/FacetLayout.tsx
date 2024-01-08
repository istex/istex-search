"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import FacetActions from "./FacetActions";
import type { FacetItem } from "./FacetContext";
import { DEFAULT_OPEN_FACETS, FACETS, FACETS_WITH_RANGE } from "./constants";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

export interface FacetLayoutProps {
  facetTitle: string;
  facetItems: FacetItem[];
}

const FacetLayout: ClientComponent<FacetLayoutProps> = ({
  facetTitle,
  facetItems,
}) => {
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();

  const isExpanded = () => {
    if (Object.keys(filters).length === 0) {
      return DEFAULT_OPEN_FACETS.includes(facetTitle) ? facetTitle : false;
    }
    return facetItems.some(
      (facetItem) => facetItem.selected || facetItem.excluded,
    ) || Object.keys(filters).includes(facetTitle)
      ? facetTitle
      : false;
  };

  const [expanded, setExpanded] = useState<string | false>(isExpanded);

  const t = useTranslations(`results.Facets.${facetTitle}`);

  const Component = FACETS.find((facet) => facet.name === facetTitle)
    ?.component;

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  if (Component == null) {
    return null;
  }

  return (
    <Accordion
      expanded={expanded === facetTitle}
      disableGutters
      elevation={0}
      onChange={handleChange(facetTitle)}
      sx={{
        backgroundColor: "transparent",
        borderBottom:
          expanded === false ? "1px solid rgba(143, 143, 143, 0.30)" : "none",
        "&:before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${facetTitle}-content`}
        id={`${facetTitle}-header`}
        sx={{
          color: "primary.main",
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: "primary.main",
          },
          "& .MuiAccordionSummary-content": {
            gap: 1,
          },
        }}
      >
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: 700,
          }}
          component="span"
        >
          {t("title")}
        </Typography>
        {!FACETS_WITH_RANGE.includes(facetTitle) && (
          <Typography component="span">({facetItems.length})</Typography>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ backgroundColor: "white" }}>
        <Component facetTitle={facetTitle} facetItems={facetItems} />
        <FacetActions facetTitle={facetTitle} />
      </AccordionDetails>
    </Accordion>
  );
};

export default FacetLayout;
