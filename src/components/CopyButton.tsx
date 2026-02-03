"use client";

import CopyIcon from "@mui/icons-material/ContentCopy";
import {
  Alert,
  IconButton,
  type IconButtonProps,
  Snackbar,
} from "@mui/material";
import { useTranslations } from "next-intl";
import * as React from "react";

interface CopyButtonProps extends IconButtonProps {
  "aria-label": string;
  clipboardText: string;
  successLabel: string;
}

export default function CopyButton(props: CopyButtonProps) {
  const {
    "aria-label": ariaLabel,
    clipboardText,
    successLabel,
    ...rest
  } = props;
  const t = useTranslations("CopyButton");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [copyState, setCopyState] = React.useState<
    "success" | "error" | "badEnv"
  >("success");

  const openSnackbar = () => {
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCopy = () => {
    if (!window.isSecureContext) {
      setCopyState("badEnv");
      openSnackbar();
      return;
    }

    navigator.clipboard
      .writeText(clipboardText)
      .then(() => {
        setCopyState("success");
      })
      .catch(() => {
        setCopyState("error");
      })
      .finally(openSnackbar);
  };

  return (
    <>
      <IconButton
        title={ariaLabel}
        aria-label={ariaLabel}
        onClick={handleCopy}
        {...rest}
      >
        <CopyIcon fontSize="inherit" />
      </IconButton>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
      >
        <Alert
          severity={copyState === "badEnv" ? "warning" : copyState}
          onClose={closeSnackbar}
        >
          {copyState === "success" ? successLabel : t(copyState)}
        </Alert>
      </Snackbar>
    </>
  );
}
