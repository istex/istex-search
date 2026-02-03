"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  type DialogProps,
  DialogTitle,
  IconButton,
  Slide,
  type SlideProps,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import { useTranslations } from "next-intl";
import type * as React from "react";

export interface ModalProps extends DialogProps {
  open: boolean; // Make open required
  onClose: () => void; // Change the signature of onClose to make it easier to pass to other components
  title: string;
  slideDirection?: SlideProps["direction"];
  children: React.ReactNode;
}

export default function Modal(props: ModalProps) {
  const t = useTranslations("Modal");
  const {
    open,
    onClose,
    title,
    slideDirection,
    fullWidth = true,
    maxWidth = "lg",
    scroll = "body",
    ...rest
  } = props;

  const Transition = (
    transitionProps: TransitionProps & { children: React.ReactElement },
  ) => {
    return <Slide direction={slideDirection} {...transitionProps} />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={slideDirection != null ? { transition: Transition } : undefined}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      scroll={scroll}
      sx={{
        "& .MuiDialog-container > .MuiPaper-root": {
          bgcolor: "colors.white",
        },
      }}
      {...rest}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        {title}
        <IconButton
          data-testid="close-modal-button"
          size="small"
          aria-label={t("closeButton")}
          title={t("closeButton")}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {props.children}
    </Dialog>
  );
}
