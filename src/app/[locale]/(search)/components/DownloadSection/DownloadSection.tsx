import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box, Container, Grid, Typography } from "@/mui/material";
import DownloadStepCard from "./DownloadStepCard";
import type { ServerComponent } from "@/types/next";

const NUMBER_OF_STEPS = 3;

const DownloadSection: ServerComponent = () => {
  const t = useTranslations("home.DownloadSection");

  return (
    <Box component="section">
      <Grid component="article" container>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ position: "relative", minHeight: "15rem" }}
        >
          <Image
            src="https://placehold.co/960x500/png"
            alt=""
            fill
            sizes="(min-width: 900px) 50vw, 100vw"
            style={{
              objectFit: "cover",
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            bgcolor: "colors.blue",
            color: "colors.white",
            px: 6,
            py: 8,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            {t("title")}
          </Typography>
          <Typography variant="body2" paragraph>
            {t("body")}
          </Typography>
        </Grid>
      </Grid>

      {/* Download steps */}
      <Container component="article" sx={{ transform: "translateY(-3rem)" }}>
        <Grid
          component="ol"
          container
          sx={{ color: "colors.white", textAlign: "center" }}
        >
          {Array(NUMBER_OF_STEPS)
            .fill(0)
            .map((_, i) => (
              <DownloadStepCard key={i} index={i} />
            ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DownloadSection;
