import * as React from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { NO_FORMAT_SELECTED } from "@/config";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { useDownload, useSearchParams, useSize } from "@/lib/hooks";
import { buildFullApiUrl } from "@/lib/istexApi";

interface DownloadButtonProps {
  closeModal: () => void;
  openWaitingModal: () => void;
}

export default function DownloadButton({
  closeModal,
  openWaitingModal,
}: DownloadButtonProps) {
  const t = useTranslations("download");
  const searchParams = useSearchParams();
  const history = useHistoryContext();
  const download = useDownload();
  const { queryString, randomSeed } = useQueryContext();
  const { selectedDocuments, excludedDocuments } = useDocumentContext();
  const selectedFormats = searchParams.getFormats();
  const filters = searchParams.getFilters();
  const sortBy = searchParams.getSortBy();
  const sortDir = searchParams.getSortDirection();
  const archiveType = searchParams.getArchiveType();
  const compressionLevel = searchParams.getCompressionLevel();
  const size = useSize();
  const isFormComplete =
    queryString !== "" && selectedFormats !== NO_FORMAT_SELECTED && size !== 0;

  const handleDownload: React.MouseEventHandler<HTMLButtonElement> = () => {
    const url = buildFullApiUrl({
      queryString,
      selectedFormats,
      size,
      filters,
      selectedDocuments,
      excludedDocuments,
      sortBy,
      sortDir,
      randomSeed,
      archiveType,
      compressionLevel,
    });

    // This hook is synchronous
    download(url);

    searchParams.setSize(size);
    history.push({
      date: Date.now(),
      searchParams,
    });

    closeModal();
    openWaitingModal();
  };

  return (
    <Button
      id="start-download-button"
      size="large"
      fullWidth
      disabled={!isFormComplete}
      onClick={handleDownload}
    >
      {t("downloadButton")}
    </Button>
  );
}
