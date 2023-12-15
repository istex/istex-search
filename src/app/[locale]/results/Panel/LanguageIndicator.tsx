"use client";

import { useTranslations } from "next-intl";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ClientComponent } from "@/types/next";

const LanguageIndicator: ClientComponent<{
  label: string;
  data: Array<{ key: string; docCount: number }>;
  total: number;
}> = ({ label, data, total }) => {
  const t = useTranslations("results.Panel");
  const theme = useTheme();
  const mainPercentage = Math.round((data[0].docCount * 100) / total);
  const CHART_SIZE = 60;
  const CIRCLE_WIDTH = 10;
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
    <Stack width="100%" alignItems="center" gap={1}>
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.8rem",
        }}
      >
        {label}
      </Typography>
      <Box
        width={CHART_SIZE}
        height={CHART_SIZE}
        display="flex"
        justifyContent="center"
        alignItems="center"
        color="colors.lightGreen"
        fontWeight={700}
        borderRadius="100%"
        position="relative"
        fontSize="0.8rem"
        sx={{
          "&:before": {
            content: "''",
            position: "absolute",
            inset: 0,
            borderRadius: "100%",
            background: createGradient(),
            WebkitMask: `radial-gradient(farthest-side,#0000 ${
              (CHART_SIZE - CIRCLE_WIDTH * 2) / 2
            }px,#000 ${(CHART_SIZE - CIRCLE_WIDTH * 2) / 2}px)`,
            mask: `radial-gradient(farthest-side,#0000 ${
              (CHART_SIZE - CIRCLE_WIDTH * 2) / 2
            }px,#000 ${(CHART_SIZE - CIRCLE_WIDTH * 2) / 2}px)`,
          },
        }}
      >
        {mainPercentage} %
      </Box>
      <Stack>
        {data
          .filter(({ docCount }) => docCount > 0)
          .map(({ key, docCount }, index) => {
            const percentage = Math.round((docCount * 100) / total);
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
                    fontSize: "0.7rem",
                  }}
                >
                  {t("languageCount", {
                    count: docCount,
                    language: key,
                    percentage,
                  })}
                </Typography>
              </Stack>
            );
          })}
      </Stack>
    </Stack>
  );
};

export default LanguageIndicator;
