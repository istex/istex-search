import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import Indicator from "./Indicator";
import LanguageIndicator from "./LanguageIndicator";
import { useQueryContext } from "@/contexts/QueryContext";

export default function IndicatorPanelContent() {
  const t = useTranslations("results.Panel");
  const { results } = useQueryContext();
  const [
    mostUsedLanguage,
    secondMostUsedLanguage,
    thirdMostUsedLanguage,
    ...otherLanguages
  ] = results.aggregations.language.buckets;
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
          results.aggregations["qualityIndicators.abstractCharCount"].buckets[0]
            .docCount
        }
        total={results.total}
      />
      <Indicator
        label={t("pdfPresence")}
        count={
          results.aggregations["qualityIndicators.pdfText"].buckets.find(
            (indicator) => indicator.keyAsString === "true",
          )?.docCount ?? 0
        }
        total={results.total}
      />
      <Indicator
        label={t("cleanedTextPresence")}
        count={
          results.aggregations["qualityIndicators.tdmReady"].buckets.find(
            (indicator) => indicator.keyAsString === "true",
          )?.docCount ?? 0
        }
        total={results.total}
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
        total={results.total}
      />
    </Box>
  );
}
