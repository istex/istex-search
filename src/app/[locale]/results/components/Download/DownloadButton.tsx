import * as React from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { NO_FORMAT_SELECTED } from "@/config";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { useDownload, useMaxSize, useSearchParams } from "@/lib/hooks";
import { buildFullApiUrl } from "@/lib/istexApi";
import { clamp } from "@/lib/utils";

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
  const size = searchParams.getSize();
  const filters = searchParams.getFilters();
  const sortBy = searchParams.getSortBy();
  const sortDir = searchParams.getSortDirection();
  const archiveType = searchParams.getArchiveType();
  const compressionLevel = searchParams.getCompressionLevel();
  const maxSize = useMaxSize();
  const isFormComplete =
    queryString !== "" && selectedFormats !== NO_FORMAT_SELECTED && size !== 0;

  const handleDownload: React.MouseEventHandler<HTMLButtonElement> = () => {
    // Clamp the size between 0 and what is possible to download
    const actualSize = clamp(size, 0, maxSize);
    searchParams.setSize(actualSize);

    const url = buildFullApiUrl({
      queryString,
      selectedFormats,
      size: actualSize,
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
