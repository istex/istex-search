"use client";

import { Grid, Typography } from "@/mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import type { ClientComponent } from "@/types/next";

const DownloadStepCard: ClientComponent<{ index: number }, true> = ({
  index,
  children,
}) => {
  const theme = useTheme();
  const lighterBlue = lighten(theme.palette.colors.blue, index * 0.2);
  const { white } = theme.palette.colors;
  const length = "0.0382rem";

  return (
    <Grid
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
      {children}
    </Grid>
  );
};

export default DownloadStepCard;
