"use client";

import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/system/colorManipulator";
import type { ClientComponent } from "@/types/next";

const Indicator: ClientComponent<{
  label: string;
  count: number;
  total: number;
}> = ({ label, count, total }) => {
  const t = useTranslations("results.Panel");
  const theme = useTheme();
  const percentage = Math.round((count * 100) / total);
  const CHART_SIZE = 60;
  const CIRCLE_WIDTH = 10;

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
      <Box
        gridRow={{ sm: 2 }}
        width={CHART_SIZE - CIRCLE_WIDTH}
        height={CHART_SIZE - CIRCLE_WIDTH}
        margin={`${CIRCLE_WIDTH / 2}px`}
        display="flex"
        justifyContent="center"
        alignItems="center"
        color="colors.lightGreen"
        fontWeight={700}
        borderRadius="100%"
        border={`${CIRCLE_WIDTH / 2}px solid`}
        borderColor={alpha(theme.palette.colors.lightGreen, 0.2)}
        position="relative"
        fontSize="0.8rem"
      >
        {`${percentage}\u00A0%`}
        <Box
          component="div"
          position="absolute"
          width={CHART_SIZE}
          height={CHART_SIZE}
          sx={{
            "&:before": {
              content: "''",
              position: "absolute",
              inset: 0,
              borderRadius: "100%",
              background: `conic-gradient(${theme.palette.colors.lightGreen} ${percentage}%, #0000 0)`,
              WebkitMask: `radial-gradient(farthest-side,#0000 ${
                (CHART_SIZE - CIRCLE_WIDTH * 2) / 2
              }px,#000 ${(CHART_SIZE - CIRCLE_WIDTH * 2) / 2}px)`,
              mask: `radial-gradient(farthest-side,#0000 ${
                (CHART_SIZE - CIRCLE_WIDTH * 2) / 2
              }px,#000 ${(CHART_SIZE - CIRCLE_WIDTH * 2) / 2}px)`,
            },
          }}
        />
      </Box>
      <Typography
        variant="subtitle2"
        gridRow={{ sm: 3 }}
        paragraph
        sx={{
          fontStyle: "italic",
          fontSize: "0.5rem",
        }}
      >
        {t("docCount", { count })}
      </Typography>
    </>
  );
};

export default Indicator;
