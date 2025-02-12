"use client";

import { useLocale, useTranslations } from "next-intl";
import { Container, Grid2 as Grid, Typography } from "@mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import { istexApiConfig } from "@/config";

const NUMBER_OF_STEPS = 3;

export default function DownloadSteps() {
  const t = useTranslations("home.DownloadSection.downloadSteps");
  const locale = useLocale();
  const theme = useTheme();
  const { white } = theme.vars.palette.colors;
  const length = "0.0382rem";

  return (
    <Container component="article" sx={{ transform: "translateY(-3rem)" }}>
      <Grid component="ol" container sx={{ color: white, textAlign: "center" }}>
        {Array(NUMBER_OF_STEPS)
          .fill(0)
          .map((_, i) => {
            const lighterBlue = lighten(theme.palette.colors.blue, i * 0.2);

            return (
              <Grid
                key={i}
                component="li"
                size={{
                  xs: 12,
                  md: 4,
                }}
                sx={{
                  bgcolor: lighterBlue,
                  p: 3,
                }}
              >
                <Typography
                  variant="h5"
                  component="span"
                  gutterBottom
                  sx={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    textShadow: `-${length} -${length} 0 ${white},
                        ${length} -${length} 0 ${white},
                       -${length}  ${length} 0 ${white},
                        ${length}  ${length} 0 ${white}`,
                    color: lighterBlue,
                  }}
                >
                  {`0${i + 1}`}
                </Typography>

                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ lineHeight: 1.2 }}
                >
                  {t(`${i}.title`)}
                </Typography>

                <Typography variant="body2">
                  {t(`${i}.body`, {
                    maxSize: istexApiConfig.maxSize.toLocaleString(locale),
                  })}
                </Typography>
              </Grid>
            );
          })}
      </Grid>
    </Container>
  );
}
