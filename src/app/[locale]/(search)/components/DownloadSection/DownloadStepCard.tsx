"use client";

import { useTranslations } from "next-intl";
import { Grid, Typography } from "@/mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import type { ClientComponent } from "@/types/next";

const DownloadStepCard: ClientComponent<{ index: number }> = ({ index }) => {
  const t = useTranslations("home.DownloadSection.downloadSteps");
  const theme = useTheme();
  const lighterBlue = lighten(theme.palette.colors.blue, index * 0.2);
  const { white } = theme.palette.colors;
  const length = "0.0382rem";

  return (
    <Grid
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
        {`0${index + 1}`}
      </Typography>

      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{ lineHeight: 1.2 }}
      >
        {t(`${index}.title`)}
      </Typography>

      <Typography variant="body2">{t(`${index}.body`)}</Typography>
    </Grid>
  );
};

export default DownloadStepCard;
