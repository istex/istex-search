"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import CopyIcon from "@mui/icons-material/ContentCopy";
import {
  Alert,
  IconButton,
  Snackbar,
  type IconButtonProps,
} from "@mui/material";

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
    sx,
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
      .writeText(props.clipboardText)
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
        title={props["aria-label"]}
        aria-label={props["aria-label"]}
        onClick={handleCopy}
        sx={sx}
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
          {copyState === "success" ? props.successLabel : t(copyState)}
        </Alert>
      </Snackbar>
    </>
  );
}
