"use client";

import { Divider as MuiDivider, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import DownloadButton from "./DownloadButton";
import FormatPicker from "./FormatPicker";
import InfoPanels from "./InfoPanels";
import ResultsSettings from "./ResultsSettings";
import UsageSelector from "./UsageSelector";
import type { ClientComponent } from "@/types/next";

const DownloadForm: ClientComponent = () => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={8}>
      <Paper elevation={0} sx={{ p: 2 }}>
        <UsageSelector />
        <Divider />
        <FormatPicker />
        <Divider />
        <ResultsSettings />
        <Divider />
        <DownloadButton />
      </Paper>
    </Grid>

    <Grid item xs={12} md={4} container spacing={2} direction="column">
      <InfoPanels />
    </Grid>
  </Grid>
);

const Divider = styled(MuiDivider)(({ theme }) => ({
  "&.MuiDivider-root": {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default DownloadForm;
