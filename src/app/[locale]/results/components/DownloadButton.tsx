"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Box, DialogContent } from "@mui/material";
import DownloadForm from "./Download/DownloadForm";
import WaitingModal from "./Download/WaitingModal";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useDocumentCount } from "@/lib/hooks";

export default function DownloadButton() {
  const t = useTranslations("results");
  const tDownload = useTranslations("download");
  const documentCount = useDocumentCount();
  const [downloadModalOpen, setDownloadModalOpen] = React.useState(false);
  const [waitingModalOpen, setWaitingModalOpen] = React.useState(false);

  const openDownloadModal = () => {
    setDownloadModalOpen(true);
  };

  const closeDownloadModal = () => {
    setDownloadModalOpen(false);
  };

  const openWaitingModal = () => {
    setWaitingModalOpen(true);
  };

  const closeWaitingModal = () => {
    setWaitingModalOpen(false);
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
          size="large"
          sx={{ px: { xs: 4, sm: 8 }, py: 2, pointerEvents: "auto" }}
          onClick={openDownloadModal}
        >
          {t("DownloadButton", {
            resultCount: documentCount,
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
          <DownloadForm
            closeModal={closeDownloadModal}
            openWaitingModal={openWaitingModal}
          />
        </DialogContent>
      </Modal>

      <WaitingModal open={waitingModalOpen} onClose={closeWaitingModal} />
    </>
  );
}
