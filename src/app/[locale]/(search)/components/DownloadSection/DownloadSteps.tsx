"use client";

import { useTranslations } from "next-intl";
import { Container, Grid, Typography } from "@mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import type { ClientComponent } from "@/types/next";

const NUMBER_OF_STEPS = 3;

const DownloadSteps: ClientComponent = () => {
  const t = useTranslations("home.DownloadSection.downloadSteps");
  const theme = useTheme();
  const { white } = theme.palette.colors;
  const length = "0.0382rem";

  return (
    <Container component="article" sx={{ transform: "translateY(-3rem)" }}>
      <Grid
        component="ol"
        container
        sx={{ color: "colors.white", textAlign: "center" }}
      >
        {Array(NUMBER_OF_STEPS)
          .fill(0)
          .map((_, i) => {
            const lighterBlue = lighten(theme.palette.colors.blue, i * 0.2);

            return (
              <Grid
                key={i}
                component="li"
                item
                xs={12}
                md={4}
                sx={{
                  bgcolor: lighterBlue,
                  p: 3,
                }}
              >
                <Typography
                  variant="h5"
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

                <Typography variant="body2">{t(`${i}.body`)}</Typography>
              </Grid>
            );
          })}
      </Grid>
    </Container>
  );
};

export default DownloadSteps;
