import { Grid, Link, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { montserrat } from "@/mui/fonts";
import CORPUS_URLS from "./corpus";

export default function CorpusGrid() {
  const t = useTranslations("home.CorpusSection.corpus.CorpusGrid");

  return (
    <Grid container spacing={1} sx={{ my: 2 }}>
      {CORPUS_URLS.map((url, i) => (
        <Grid key={t(`${i}.title`)} size={6}>
          <Paper
            elevation={0}
            sx={{ p: 2, bgcolor: "colors.white", height: "100%" }}
          >
            <Typography variant="body2">{t(`${i}.collectionTitle`)}</Typography>
            <Link
              underline="hover"
              href={url}
              target="_blank"
              rel="noreferrer"
              sx={{
                fontWeight: "bold",
                fontFamily: montserrat.style.fontFamily,
              }}
            >
              {t(`${i}.title`)}
            </Link>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
