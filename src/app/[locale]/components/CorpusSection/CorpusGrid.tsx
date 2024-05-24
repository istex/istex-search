import { Grid, Link, Paper, Typography } from "@mui/material";
import corpus from "./corpus";
import { montserrat } from "@/mui/fonts";

export default function CorpusGrid() {
  return (
    <Grid container spacing={1} sx={{ my: 2 }}>
      {corpus.map(({ title, collection, url }) => (
        <Grid key={title} item xs={6}>
          <Paper
            elevation={0}
            sx={{ p: 2, bgcolor: "colors.white", height: "100%" }}
          >
            <Typography variant="body2">Collection {collection}</Typography>
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
              {title}
            </Link>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
