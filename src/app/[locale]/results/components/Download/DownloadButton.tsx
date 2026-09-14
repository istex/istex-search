import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type * as React from "react";
import Button from "@/components/Button";
import { NO_FORMAT_SELECTED } from "@/config";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { useDownload, useSize } from "@/lib/hooks";
import { buildFullApiUrl } from "@/lib/istexApi";
import {
  useArchiveType,
  useCompressionLevel,
  useFilters,
  useSelectedFormats,
  useSortBy,
  useSortDirection,
} from "@/lib/searchParams";

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
  const [selectedFormats] = useSelectedFormats();
  const [filters] = useFilters();
  const [sortBy] = useSortBy();
  const [sortDirection] = useSortDirection();
  const [archiveType] = useArchiveType();
  const [compressionLevel] = useCompressionLevel();
  const [size] = useSize();
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
      sortDirection,
      randomSeed,
      archiveType,
      compressionLevel,
    });

    // This hook is synchronous
    download(url);

    const newSearchParams = new URLSearchParams(searchParams);
    if (randomSeed != null) {
      newSearchParams.set("randomSeed", randomSeed?.toString());
    }

    history.push({
      date: Date.now(),
      searchParams: newSearchParams.toString(),
      selectedDocuments,
      excludedDocuments,
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
