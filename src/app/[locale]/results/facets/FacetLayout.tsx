"use client";

import { useTranslations } from "next-intl";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import FacetActions from "./FacetActions";
import type { ClientComponent } from "@/types/next";

const FacetLayout: ClientComponent<
  { facetTitle: string; count: number },
  true
> = ({ facetTitle, count, children }) => {
  const t = useTranslations("results.Facets");

  return (
    <Accordion
      disableGutters
      elevation={0}
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
          {t(`${facetTitle}.title`)}
        </Typography>
        <Typography component="span">({count})</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ backgroundColor: "white" }}>
        {children}
        <FacetActions facetTitle={facetTitle} />
      </AccordionDetails>
    </Accordion>
  );
};

export default FacetLayout;
