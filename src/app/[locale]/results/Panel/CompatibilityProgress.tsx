"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { LinearProgress, Typography } from "@mui/material";
import type { ClientComponent } from "@/types/next";

const CompatibilityProgress: ClientComponent<{
  title: string;
  data: { label: string; count: number }[];
  total: number;
  gridColumn: number;
  gridRow: number;
}> = ({ title, data, total, gridColumn, gridRow }) => {
  const t = useTranslations("results.Panel");

  return (
    <>
      <Typography
        gridRow={{ sm: 1 + gridRow }}
        gridColumn={{ xs: "span 3", sm: `${gridColumn * 3 - 2} / span 3` }}
        mx={5}
        mb={0.625}
        mt={{ sm: gridRow === 3 ? "-10px" : 1 }}
        variant="body2"
        textAlign="center"
        sx={{
          color: "colors.lightBlack",
          fontSize: "0.8rem",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>
      {data.map(({ label, count }, index) => (
        <React.Fragment key={label}>
          <Typography
            gridRow={{ sm: index + 2 + gridRow }}
            gridColumn={{ sm: gridColumn * 3 - 2 }}
            ml={5}
            justifySelf="end"
            variant="subtitle2"
            component="span"
            sx={{
              fontStyle: "italic",
              fontSize: "0.5rem",
              textTransform: "uppercase",
            }}
          >
            {label}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(count * 100) / total}
            sx={{
              gridRow: { sm: index + 2 + gridRow },
              gridColumn: { sm: gridColumn * 3 - 1 },
              width: "100%",
              height: 5,
              borderRadius: 2.5,
              bgcolor: "colors.lightGrey",
              "& .MuiLinearProgress-bar": {
                bgcolor: "colors.lightGreen",
              },
            }}
          />
          <Typography
            gridRow={{ sm: index + 2 + gridRow }}
            gridColumn={{ sm: gridColumn * 3 }}
            mr={5}
            variant="subtitle2"
            component="span"
            sx={{
              fontStyle: "italic",
              fontSize: "0.5rem",
            }}
          >
            {t("docCount", { count })}
          </Typography>
        </React.Fragment>
      ))}
    </>
  );
};

export default CompatibilityProgress;
