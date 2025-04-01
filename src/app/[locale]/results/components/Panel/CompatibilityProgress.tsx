import * as React from "react";
import { useTranslations } from "next-intl";
import { Grid, LinearProgress, Typography } from "@mui/material";
import { useQueryContext } from "@/contexts/QueryContext";

interface CompatibilityProgressProps {
  name: string;
  compatibilityCount: number;
  data: { label: string; count: number }[];
}

export default function CompatibilityProgress({
  name,
  compatibilityCount,
  data,
}: CompatibilityProgressProps) {
  const t = useTranslations("results.Panel");
  const { results } = useQueryContext();

  const percentage =
    results.total > 0
      ? Math.round((compatibilityCount * 100) / results.total)
      : 0;

  return (
    <Grid size={{ xs: 12, sm: 6 }} data-testid={`${name}-compatibility`}>
      <Typography
        id={`${name}-compatibility-label`}
        variant="body2"
        sx={{
          textAlign: "center",
          color: "colors.lightBlack",
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >
        {`${name} (${percentage}\u00A0%)`}
      </Typography>
      <Grid
        container
        columnSpacing={1}
        sx={{
          "& > *": { fontSize: "0.5rem" },
          "& .MuiTypography-root": { fontSize: "inherit", fontStyle: "italic" },
        }}
      >
        {data.map(({ label, count }) => (
          <React.Fragment key={label}>
            <Grid size={3} sx={{ textAlign: "end" }}>
              <Typography
                variant="subtitle2"
                component="span"
                sx={{
                  textTransform: "uppercase",
                }}
              >
                {label}
              </Typography>
            </Grid>
            <Grid size={6} sx={{ alignSelf: "center" }}>
              <LinearProgress
                variant="determinate"
                value={results.total > 0 ? (count * 100) / results.total : 0}
                aria-labelledby={`${name}-compatibility-label`}
                sx={{
                  borderRadius: 2.5,
                  bgcolor: "colors.lightGrey",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "colors.lightGreen",
                  },
                }}
              />
            </Grid>
            <Grid size={3}>
              <Typography variant="subtitle2" component="span">
                {t("docCount", { count })}
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Grid>
  );
}
