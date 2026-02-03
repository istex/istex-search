import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocale, useTranslations } from "next-intl";
import { labelizeIsoLanguage } from "@/lib/utils";
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
  const tLanguages = useTranslations("languages");
  const theme = useTheme();
  const locale = useLocale();
  const mainPercentage =
    data.length > 0 && total > 0
      ? Math.floor((data[0].docCount * 100) / total)
      : 0;
  const COLORS = [
    theme.vars.palette.colors.lightGreen,
    theme.vars.palette.colors.red,
    theme.vars.palette.colors.blue,
    theme.vars.palette.colors.grey,
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
        sx={{
          gridRow: { sm: 1 },
          color: "colors.lightBlack",
          fontSize: "0.75rem",
        }}
      >
        {label}
      </Typography>
      <IndicatorChart percentage={mainPercentage} gradient={createGradient()} />
      {data.length > 0 ? (
        <Stack
          sx={{
            gridRow: { sm: 3 },
          }}
        >
          {data.map(({ key, docCount }, index) => {
            const rawPercentage = (docCount * 100) / total;
            const percentage = rawPercentage.toLocaleString(locale, {
              maximumFractionDigits: 1,
            });

            return (
              <Stack
                key={key}
                direction="row"
                sx={{
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    bgcolor: COLORS[index],
                    width: 10,
                    height: 10,
                    borderRadius: "100%",
                  }}
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
                        : labelizeIsoLanguage(
                            locale,
                            key as string,
                            tLanguages,
                          ),
                    percentage,
                  })}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      ) : (
        <Typography
          component="span"
          variant="subtitle2"
          sx={{
            gridRow: { sm: 3 },
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
