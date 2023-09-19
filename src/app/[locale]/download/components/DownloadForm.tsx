"use client";

import { useTranslations } from "next-intl";
import { redirect } from "next-intl/server";
import { Divider as MuiDivider, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import DownloadButton from "./DownloadButton";
import FormatPicker from "./FormatPicker";
import InfoPanels from "./InfoPanels";
import ResultsSettings from "./ResultsSettings";
import UsageSelector from "./UsageSelector";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

interface DownloadFormProps {
  resultsCount: number;
  displayTitle?: boolean;
}

const DownloadForm: ClientComponent<DownloadFormProps> = ({
  resultsCount,
  displayTitle,
}) => {
  const t = useTranslations("download");
  const searchParams = useSearchParams();
  const queryString = searchParams.getQueryString();

  if (queryString === "") {
    redirect("/");
  }

  return (
    <>
      {displayTitle === true && (
        <Typography component="h1" variant="h5" gutterBottom>
          {t("title")}
        </Typography>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 2 }}>
            <UsageSelector />
            <Divider />
            <FormatPicker />
            <Divider />
            <ResultsSettings resultsCount={resultsCount} />
            <Divider />
            <DownloadButton />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} container spacing={2} direction="column">
          <InfoPanels />
        </Grid>
      </Grid>
    </>
  );
};

const Divider = styled(MuiDivider)(({ theme }) => ({
  "&.MuiDivider-root": {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default DownloadForm;
