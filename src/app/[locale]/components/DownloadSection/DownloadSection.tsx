import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import DownloadSteps from "./DownloadSteps";
import downloadImage from "@/../public/download.jpg";

export default function DownloadSection() {
  const t = useTranslations("home.DownloadSection");

  return (
    <Box component="section">
      <Grid component="article" container>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
          sx={{ position: "relative", minHeight: "15rem" }}
        >
          <Image
            src={downloadImage}
            alt=""
            fill
            sizes="(min-width: 900px) 50vw, 100vw"
            style={{
              objectFit: "cover",
            }}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
          sx={{
            bgcolor: "colors.blue",
            color: "colors.white",
            px: 6,
            py: 8,
          }}
        >
          {/*
           * Setting a max width in pixels is not the best practice but I couldn't
           * a way to align the text with the Container of other sections but keep
           * the background color and image on the entire screen width.
           */}
          <Box sx={{ maxWidth: { md: "unset", lg: "525px" } }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
              {t("title")}
            </Typography>
            <Typography variant="body2">{t("body")}</Typography>
          </Box>
        </Grid>
      </Grid>

      <DownloadSteps />
    </Box>
  );
}
