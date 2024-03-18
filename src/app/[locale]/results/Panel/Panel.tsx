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
import { useQueryContext } from "@/contexts/QueryContext";
import type { ClientComponent } from "@/types/next";

interface PanelProps {
  title: string;
  open?: boolean;
}

const Panel: ClientComponent<PanelProps, true> = ({
  title,
  open,
  children,
}) => {
  const t = useTranslations("results.Panel");
  const [expanded, setExpanded] = useState(open ?? true);
  const { resultsCount } = useQueryContext();

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
      }}
      disableGutters
      elevation={0}
      sx={{
        borderRadius: 1,
        bgcolor: "colors.veryLightBlue",
        "&:before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${title}-panel-content`}
        id={`${title}-panel-header`}
        sx={{
          color: "colors.darkBlack",
          "& .MuiAccordionSummary-content": {
            gap: 1,
            alignItems: "center",
          },
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: "primary.main",
            p: 0.5,
            borderRadius: "100%",
          },
        }}
      >
        <Typography
          variant="body2"
          component="span"
          sx={{
            fontWeight: 700,
          }}
        >
          {t(title)}
        </Typography>
        {resultsCount > 0 && (
          <Typography
            variant="body2"
            component="span"
            sx={{
              fontSize: "0.8rem",
            }}
          >
            {t("resultsCount", { count: resultsCount })}
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ color: "colors.grey" }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default Panel;
