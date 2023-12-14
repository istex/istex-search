"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import type { ClientComponent } from "@/types/next";

const CompatibilityProgress: ClientComponent<{
  title: string;
  data: Array<{ label: string; count: number }>;
  total: number;
}> = ({ title, data, total }) => {
  const t = useTranslations("results.Panel");

  return (
    <Stack width="100%" gap={1} px={3}>
      <Typography
        variant="body2"
        textAlign="center"
        sx={{
          fontSize: "0.8rem",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns="auto 1fr auto"
        columnGap={1}
        alignItems="center"
      >
        {data.map(({ label, count }) => (
          <Fragment key={label}>
            <Typography
              justifySelf="end"
              variant="subtitle2"
              component="span"
              sx={{
                fontStyle: "italic",
                fontSize: "0.7rem",
                textTransform: "uppercase",
              }}
            >
              {label}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(count * 100) / total}
              sx={{
                flexGrow: 1,
                width: "100%",
                height: 5,
                borderRadius: 2.5,
                bgcolor: "colors.grey",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "colors.lightGreen",
                },
              }}
            />
            <Typography
              variant="subtitle2"
              component="span"
              sx={{
                fontStyle: "italic",
                fontSize: "0.7rem",
              }}
            >
              {t("docCount", { count })}
            </Typography>
          </Fragment>
        ))}
      </Box>
    </Stack>
  );
};

export default CompatibilityProgress;
