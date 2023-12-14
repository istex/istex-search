"use client";

import { useTranslations } from "next-intl";
import { Stack } from "@mui/material";
import Indicator from "./Indicator";
import LanguageIndicator from "./LanguageIndicator";
import { useQueryContext } from "@/contexts/QueryContext";
import type { Aggregation } from "@/lib/istexApi";
import type { ClientComponent } from "@/types/next";

const IndicatorPanelContent: ClientComponent<{ indicators: Aggregation }> = ({
  indicators,
}) => {
  const t = useTranslations("results.Panel");
  const { resultsCount } = useQueryContext();

  return (
    <Stack direction={{ xs: "column", sm: "row" }}>
      <Indicator
        label={t("summaryPresence")}
        count={
          indicators["qualityIndicators.abstractCharCount"].buckets[0].docCount
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
  );
};

export default IndicatorPanelContent;
