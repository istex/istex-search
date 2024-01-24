"use client";

import { useState, type MouseEventHandler } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Box } from "@mui/material";
import { useDocumentContext } from "../Document/DocumentContext";
import DownloadForm from "../Download/DownloadForm";
import DownloadModal from "../Download/DownloadModal";
import Button from "@/components/Button";
import { useQueryContext } from "@/contexts/QueryContext";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const DownloadButton: ClientComponent = () => {
  const t = useTranslations("results");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const size = searchParams.getSize();
  const { resultsCount } = useQueryContext();
  const { selectedDocuments, excludedDocuments } = useDocumentContext();
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const documentsCount =
    selectedDocuments.length > 0
      ? selectedDocuments.length
      : resultsCount - excludedDocuments.length;

  const openDownloadModal: MouseEventHandler<HTMLButtonElement> = () => {
    // If the size is not set, make it the result count by default
    // NOTE: It's not the best solution in terms of performance because it implies
    // re-rendering the whole /results page just to change the size
    if (size === 0) {
      searchParams.setSize(documentsCount);
      router.replace(`${pathname}?${searchParams.toString()}`, {
        scroll: false,
      });
    }

    setDownloadModalOpen(true);
  };

  const closeDownloadModal = () => {
    setDownloadModalOpen(false);
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          position: "sticky",
          bottom: theme.spacing(8),
          textAlign: "center",
          zIndex: 1,
          pointerEvents: "none",
        })}
      >
        <Button
          id="download-button"
          size="large"
          sx={{ px: { xs: 4, sm: 8 }, py: 2, pointerEvents: "auto" }}
          onClick={openDownloadModal}
        >
          {t("downloadButton", {
            resultsCount: documentsCount.toLocaleString(locale),
          })}
        </Button>
      </Box>

      <DownloadModal open={downloadModalOpen} onClose={closeDownloadModal}>
        <DownloadForm />
      </DownloadModal>
    </>
  );
};

export default DownloadButton;
