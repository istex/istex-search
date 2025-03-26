import * as React from "react";
import { Grid2 as Grid, Divider, Stack } from "@mui/material";
import ArchiveSettings from "./ArchiveSettings";
import ArchiveSizeWarning from "./ArchiveSizeWarning";
import DownloadButton from "./DownloadButton";
import FormatPicker from "./FormatPicker";
import InfoPanels from "./InfoPanels";
import ResultsSettings from "./ResultsSettings";
import SelectedDocPanel from "./SelectedDocPanel";
import UsageSelector from "./UsageSelector";
import Panel from "@/components/Panel";
import { ARCHIVE_SIZE_THRESHOLD_WARNING } from "@/config";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { estimateArchiveSize } from "@/lib/formats";
import { useMaxSize, useSearchParams } from "@/lib/hooks";

const ONE_GIGABYTE = 1 * 1024 * 1024 * 1024;

interface DownloadFormProps {
  closeModal: () => void;
  openWaitingModal: () => void;
}

export default function DownloadForm({
  closeModal,
  openWaitingModal,
}: DownloadFormProps) {
  const searchParams = useSearchParams();
  const selectedFormats = searchParams.getFormats();
  const compressionLevel = searchParams.getCompressionLevel();
  const archiveType = searchParams.getArchiveType();
  const maxSize = useMaxSize();
  const { selectedDocuments } = useDocumentContext();
  const hasSelectedDocuments = selectedDocuments.length > 0;
  const [archiveSizeInGigabytes, setArchiveSizeInGigabytes] = React.useState(0);

  React.useEffect(() => {
    const archiveSize = estimateArchiveSize(
      selectedFormats,
      maxSize,
      compressionLevel,
      archiveType,
    );
    const archiveSizeRoundedToLowerGigabyte = Math.floor(
      archiveSize / ONE_GIGABYTE,
    );

    setArchiveSizeInGigabytes(archiveSizeRoundedToLowerGigabyte);
  }, [selectedFormats, maxSize, compressionLevel, archiveType]);

  return (
    <Grid
      container
      spacing={2}
      sx={{ "& .MuiPaper-root": { bgcolor: "white" } }}
    >
      <Grid size={{ xs: 12, sm: hasSelectedDocuments ? 5 : 8 }}>
        <Panel>
          <Stack spacing={2}>
            <UsageSelector />
            <Divider />
            <FormatPicker />
            <Divider />
            <ResultsSettings />
            <Divider />
            <ArchiveSettings />
            {archiveSizeInGigabytes >= ARCHIVE_SIZE_THRESHOLD_WARNING && (
              <>
                <Divider />
                <ArchiveSizeWarning size={archiveSizeInGigabytes} />
              </>
            )}
            <DownloadButton
              closeModal={closeModal}
              openWaitingModal={openWaitingModal}
            />
          </Stack>
        </Panel>
      </Grid>

      <Grid
        size={{ xs: 12, sm: hasSelectedDocuments ? 3 : 4 }}
        container
        spacing={2}
        direction="column"
      >
        <InfoPanels />
      </Grid>
      {hasSelectedDocuments && (
        <Grid size={{ xs: 12, md: 4 }}>
          <SelectedDocPanel />
        </Grid>
      )}
    </Grid>
  );
}
