import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import Indicator from "./Indicator";
import LanguageIndicator from "./LanguageIndicator";
import { useQueryContext } from "@/contexts/QueryContext";
import type { Aggregation } from "@/lib/istexApi";

interface IndicatorPanelContentProps {
  indicators: Aggregation;
}

export default function IndicatorPanelContent({
  indicators,
}: IndicatorPanelContentProps) {
  const t = useTranslations("results.Panel");
  const { resultsCount } = useQueryContext();

  const [
    mostUsedLanguage,
    secondMostUsedLanguage,
    thirdMostUsedLanguage,
    ...otherLanguages
  ] = indicators.language.buckets;
  const otherLanguagesCount = otherLanguages.reduce(
    (acc, language) => acc + language.docCount,
    0,
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
        rowGap: 1,
        justifyItems: "center",
      }}
    >
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
          mostUsedLanguage,
          secondMostUsedLanguage,
          thirdMostUsedLanguage,
          {
            key: "other",
            docCount: otherLanguagesCount,
          },
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        ].filter((language) => language?.docCount > 0)}
        total={resultsCount}
      />
    </Box>
  );
}
