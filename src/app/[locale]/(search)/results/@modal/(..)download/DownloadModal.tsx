"use client";

import { useState, forwardRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { TransitionProps } from "@mui/material/transitions";
import type { ClientComponent } from "@/types/next";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DownloadModal: ClientComponent<Record<string, unknown>, true> = ({
  children,
}) => {
  const t = useTranslations("download");
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  const close = () => {
    setOpen(false);

    // Wait until the leaving screen animation is over to go back to the /results page
    setTimeout(() => {
      router.back();
    }, theme.transitions.duration.leavingScreen);
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      TransitionComponent={Transition}
      maxWidth="xl"
      scroll="body"
    >
      <DialogTitle sx={{ bgcolor: "colors.white" }}>{t("title")}</DialogTitle>
      <IconButton
        onClick={close}
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
