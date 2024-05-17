"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Box, DialogContent } from "@mui/material";
import DownloadForm from "./Download/DownloadForm";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useQueryContext } from "@/contexts/QueryContext";
import type { ClientComponent } from "@/types/next";

const DownloadButton: ClientComponent = () => {
  const t = useTranslations("results");
  const tDownload = useTranslations("download");
  const locale = useLocale();
  const { resultsCount } = useQueryContext();
  const { selectedDocuments, excludedDocuments } = useDocumentContext();
  const [downloadModalOpen, setDownloadModalOpen] = React.useState(false);

  const documentsCount =
    selectedDocuments.length > 0
      ? selectedDocuments.length
      : resultsCount - excludedDocuments.length;

  const openDownloadModal = () => {
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
          id="open-download-modal-button"
          size="large"
          sx={{ px: { xs: 4, sm: 8 }, py: 2, pointerEvents: "auto" }}
          onClick={openDownloadModal}
        >
          {t("DownloadButton", {
            resultsCount: documentsCount.toLocaleString(locale),
          })}
        </Button>
      </Box>

      <Modal
        title={tDownload("title")}
        open={downloadModalOpen}
        onClose={closeDownloadModal}
        slideDirection="up"
      >
        <DialogContent dividers>
          <DownloadForm />
        </DialogContent>
      </Modal>
    </>
  );
};

export default DownloadButton;
