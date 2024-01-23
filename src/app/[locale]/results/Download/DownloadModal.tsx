"use client";

import { forwardRef } from "react";
import { useTranslations } from "next-intl";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import type { ClientComponent } from "@/types/next";

export const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
}

const DownloadModal: ClientComponent<DownloadModalProps, true> = ({
  open,
  onClose,
  children,
}) => {
  const t = useTranslations("download");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="xl"
      scroll="body"
    >
      <DialogTitle sx={{ bgcolor: "colors.white" }}>{t("title")}</DialogTitle>
      <IconButton
        data-testid="close-modal-button"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ bgcolor: "colors.white" }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DownloadModal;
