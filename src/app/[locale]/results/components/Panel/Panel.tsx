import * as React from "react";
import { useTranslations } from "next-intl";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { useQueryContext } from "@/contexts/QueryContext";

export type PanelName = "indicators" | "compatibility";

interface PanelProps {
  title: PanelName;
  expanded: boolean;
  setExpanded: (name: PanelName, expanded: boolean) => void;
  children: React.ReactNode;
}

export default function Panel({
  title,
  expanded,
  setExpanded,
  children,
}: PanelProps) {
  const t = useTranslations("results.Panel");
  const { results } = useQueryContext();

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {
        setExpanded(title, !expanded);
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
            fontWeight: "bold",
          }}
        >
          {t(title)}
        </Typography>
        {results.total > 0 && (
          <Typography
            variant="body2"
            component="span"
            sx={{
              fontSize: "0.8rem",
            }}
          >
            {t("resultCount", { count: results.total })}
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ color: "colors.grey" }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
