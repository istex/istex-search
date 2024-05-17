"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  Slide,
  DialogTitle,
  IconButton,
  type DialogProps,
  type SlideProps,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import type { ClientComponent } from "@/types/next";

export interface ModalProps extends DialogProps {
  open: boolean; // Make open required
  onClose: () => void; // Change the signature of onClose to make it easier to pass to other components
  title: string;
  slideDirection?: SlideProps["direction"];
}

const Modal: ClientComponent<ModalProps, true> = (props) => {
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

  const Transition = React.useMemo(() => {
    return React.forwardRef(function Transition(
      transitionProps: TransitionProps & { children: React.ReactElement },
      ref: React.Ref<unknown>,
    ) {
      return (
        <Slide direction={slideDirection} ref={ref} {...transitionProps} />
      );
    });
  }, [slideDirection]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={slideDirection != null ? Transition : undefined}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      scroll={scroll}
      sx={{
        "& .MuiPaper-root": {
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
};

export default Modal;
