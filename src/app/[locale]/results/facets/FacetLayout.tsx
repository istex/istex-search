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
import { FACETS } from "./constants";
import type { ClientComponent } from "@/types/next";

export interface FacetLayoutProps {
  facetTitle: string;
  facetItems: FacetItem[];
}

const FacetLayout: ClientComponent<FacetLayoutProps> = ({
  facetTitle,
  facetItems,
}) => {
  const [expanded, setExpanded] = useState<string | false>(
    facetItems.some((facetItem) => facetItem.selected) ? facetTitle : false,
  );

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
        {facetTitle !== "publicationDate" && (
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
