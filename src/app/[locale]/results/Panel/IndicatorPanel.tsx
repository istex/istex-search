"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import { lighten } from "@mui/system/colorManipulator";
import Indicator from "./Indicator";
import LanguageIndicator from "./LanguageIndicator";
import { useQueryContext } from "@/contexts/QueryContext";
import type { Aggregation } from "@/lib/istexApi";
import type { ClientComponent } from "@/types/next";

const IndicatorPanel: ClientComponent<{ indicators: Aggregation }> = ({
  indicators,
}) => {
  const t = useTranslations("results.Panel");
  const [expanded, setExpanded] = useState(false);
  const { resultsCount } = useQueryContext();

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
      }}
      disableGutters
      elevation={0}
      sx={(theme) => ({
        borderRadius: 1,
        bgcolor: lighten(theme.palette.colors.blue, 0.9),
        "&:before": {
          display: "none",
        },
      })}
    >
      <AccordionSummary
        expandIcon={expanded ? <VisibilityOffIcon /> : <VisibilityIcon />}
        aria-controls="indicator-panel-content"
        id="indicator-panel-header"
        sx={{
          "& .MuiAccordionSummary-content": {
            gap: 1,
            alignItems: "center",
          },
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: "primary.main",
            bgcolor: "white",
            p: 0.5,
            borderRadius: "100%",
          },
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "none",
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
          {t("indicators")}
        </Typography>
        <Typography
          variant="body2"
          component="span"
          sx={{
            fontSize: "0.8rem",
          }}
        >
          {t("resultsCount", { count: resultsCount })}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row">
          <Indicator
            label={t("summaryPresence")}
            count={
              indicators["qualityIndicators.abstractCharCount"].buckets[0]
                .docCount
            }
            total={resultsCount}
          />
          <Indicator
            label={t("pdfPresence")}
            count={
              indicators["qualityIndicators.pdfText"].buckets.find(
                (indicator) => indicator.keyAsString === "true",
              )?.docCount ?? 0
            }
            total={resultsCount}
          />
          <Indicator
            label={t("cleanedTextPresence")}
            count={
              indicators["qualityIndicators.tdmReady"].buckets.find(
                (indicator) => indicator.keyAsString === "true",
              )?.docCount ?? 0
            }
            total={resultsCount}
          />
          <LanguageIndicator
            label={t("publicationLanguage")}
            data={[
              ...indicators.language.buckets,
              {
                key: "other",
                docCount: indicators.language.sumOtherDocCount ?? 0,
              },
            ]}
            total={resultsCount}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default IndicatorPanel;
