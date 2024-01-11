"use client";

import type { MouseEventHandler } from "react";
import { useTranslations } from "next-intl";
import { useDocumentContext } from "../Document/DocumentContext";
import Button from "@/components/Button";
import { NO_FORMAT_SELECTED } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import { buildFullApiUrl } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const DownloadButton: ClientComponent = () => {
  const t = useTranslations("download");
  const searchParams = useSearchParams();
  const { queryString } = useQueryContext();
  const { selectedDocuments, excludedDocuments } = useDocumentContext();
  const selectedFormats = searchParams.getFormats();
  const size = searchParams.getSize();
  const filters = searchParams.getFilters();
  const isFormComplete =
    queryString !== "" && selectedFormats !== NO_FORMAT_SELECTED && size !== 0;

  const handleDownload: MouseEventHandler<HTMLButtonElement> = () => {
    const url = buildFullApiUrl({
      queryString,
      selectedFormats,
      size,
      filters,
      selectedDocuments,
      excludedDocuments,
    });

    // Hack to download the archive and see the progression in the download bar built in browsers
    // We create a fake 'a' tag that points to the URL we just built and simulate a click on it
    const link = document.createElement("a");
    link.href = url.toString();

    // These attributes are set to open the URL in another tab, this is useful when the user is
    // redirected to the identity federation page so that they don't lose the current Istex-DL page
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");

    link.click();
  };

  return (
    <Button
      id="download-button"
      size="large"
      fullWidth
      disabled={!isFormComplete}
      onClick={handleDownload}
    >
      {t("downloadButton")}
    </Button>
  );
};

export default DownloadButton;
