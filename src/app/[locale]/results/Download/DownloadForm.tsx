"use client";

import { Grid, Divider as MuiDivider } from "@mui/material";
import { styled } from "@mui/material/styles";
import DownloadButton from "./DownloadButton";
import FormatPicker from "./FormatPicker";
import InfoPanels from "./InfoPanels";
import Panel from "./Panel";
import ResultsSettings from "./ResultsSettings";
import SelectedDocPanel from "./SelectedDocPanel";
import UsageSelector from "./UsageSelector";
import { useDocumentContext } from "@/contexts/DocumentContext";
import type { ClientComponent } from "@/types/next";

const DownloadForm: ClientComponent = () => {
  const { selectedDocuments } = useDocumentContext();

  const hasSelectedDocuments = selectedDocuments.length > 0;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={hasSelectedDocuments ? 5 : 8}>
        <Panel>
          <UsageSelector />
          <Divider />
          <FormatPicker />
          <Divider />
          <ResultsSettings />
          <Divider />
          <DownloadButton />
        </Panel>
      </Grid>

      <Grid
        item
        xs={12}
        md={hasSelectedDocuments ? 3 : 4}
        container
        spacing={2}
        direction="column"
      >
        <InfoPanels />
      </Grid>
      {hasSelectedDocuments && (
        <Grid item xs={12} md={4}>
          <SelectedDocPanel />
        </Grid>
      )}
    </Grid>
  );
};

const Divider = styled(MuiDivider)(({ theme }) => ({
  "&.MuiDivider-root": {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default DownloadForm;
