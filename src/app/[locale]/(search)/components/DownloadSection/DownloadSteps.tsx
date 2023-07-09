import { useTranslations } from "next-intl";
import { Container, Grid, Typography } from "@/mui/material";
import DownloadStepCard from "./DownloadStepCard";
import type { ServerComponent } from "@/types/next";

const NUMBER_OF_STEPS = 3;

const DownloadSteps: ServerComponent = () => {
  const t = useTranslations("Home.DownloadSection.downloadSteps");

  return (
    <Container component="article" sx={{ transform: "translateY(-3rem)" }}>
      <Grid
        component="ol"
        container
        sx={{ color: "colors.white", textAlign: "center" }}
      >
        {Array(NUMBER_OF_STEPS)
          .fill(0)
          .map((_, i) => (
            <DownloadStepCard key={t(`${i}.title`)} index={i}>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ lineHeight: 1.2 }}
              >
                {t(`${i}.title`)}
              </Typography>
              <Typography variant="body2">{t(`${i}.body`)}</Typography>
            </DownloadStepCard>
          ))}
      </Grid>
    </Container>
  );
};

export default DownloadSteps;
