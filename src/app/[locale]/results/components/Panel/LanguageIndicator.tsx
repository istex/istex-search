import { useLocale, useTranslations } from "next-intl";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getLanguageLabel } from "../Facets/utils";
import IndicatorChart from "./IndicatorChart";

interface LanguageIndicatorProps {
  label: string;
  data: { key: string | number; docCount: number }[];
  total: number;
}

export default function LanguageIndicator({
  label,
  data,
  total,
}: LanguageIndicatorProps) {
  const t = useTranslations("results.Panel");
  const tFacets = useTranslations("results.Facets");
  const theme = useTheme();
  const locale = useLocale();
  const mainPercentage =
    data.length > 0 && total > 0
      ? Math.floor((data[0].docCount * 100) / total)
      : 0;
  const COLORS = [
    theme.palette.colors.lightGreen,
    theme.palette.colors.red,
    theme.palette.colors.blue,
    theme.palette.colors.grey,
  ];

  const createGradient = () => {
    let conicGradient = "conic-gradient(";
    let previousPercentage = 0;
    for (let i = 0; i < data.length; i++) {
      const percentage = (data[i].docCount * 100) / total;
      conicGradient += `${COLORS[i]} ${previousPercentage}% ${
        previousPercentage + percentage
      }%`;
      if (i < data.length - 1) {
        conicGradient += ", ";
      }
      previousPercentage += percentage;
    }
    conicGradient += ")";

    return conicGradient;
  };

  return (
    <>
      <Typography
        variant="body2"
        align="center"
        gridRow={{ sm: 1 }}
        sx={{
          color: "colors.lightBlack",
          fontSize: "0.75rem",
        }}
      >
        {label}
      </Typography>

      <IndicatorChart percentage={mainPercentage} gradient={createGradient()} />

      {data.length > 0 ? (
        <Stack gridRow={{ sm: 3 }}>
          {data.map(({ key, docCount }, index) => {
            const rawPercentage = (docCount * 100) / total;
            const percentage = rawPercentage.toLocaleString(locale, {
              maximumFractionDigits: 1,
            });

            return (
              <Stack key={key} direction="row" gap={0.5} alignItems="center">
                <Box
                  component="span"
                  bgcolor={COLORS[index]}
                  width={10}
                  height={10}
                  borderRadius="100%"
                />
                <Typography
                  variant="subtitle2"
                  component="span"
                  sx={{
                    fontStyle: "italic",
                    fontSize: "0.5rem",
                  }}
                >
                  {t("languageCount", {
                    count: docCount,
                    language:
                      key === "other"
                        ? t("otherLanguage")
                        : getLanguageLabel(key as string, locale, tFacets),
                    percentage,
                  })}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      ) : (
        <Typography
          variant="subtitle2"
          gridRow={{ sm: 3 }}
          paragraph
          sx={{
            fontStyle: "italic",
            fontSize: "0.5rem",
          }}
        >
          {t("docCount", { count: 0 })}
        </Typography>
      )}
    </>
  );
}
