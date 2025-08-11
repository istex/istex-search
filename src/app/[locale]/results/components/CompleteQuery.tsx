"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import CopyIcon from "@mui/icons-material/ContentCopy";
import {
  Alert,
  Container,
  IconButton,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { useSearchParams } from "@/lib/hooks";
import { createCompleteQuery } from "@/lib/istexApi";

const QUERY_MAX_SIZE = 256;

export default function CompleteQuery() {
  const t = useTranslations("results.CompleteQuery");
  const searchParams = useSearchParams();
  const { queryString } = useQueryContext();
  const { selectedDocuments, excludedDocuments } = useDocumentContext();
  const filters = searchParams.getFilters();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [copyState, setCopyState] = React.useState<
    "success" | "error" | "badEnv"
  >("success");
  const completeQuery = createCompleteQuery(
    queryString,
    filters,
    selectedDocuments,
    excludedDocuments,
  );

  // The complete query is potentially very long and is only displayed on one line anyway.
  // Since it can contain a list of identifiers that can be analyzed by browser extensions such
  // as Click & Read or Zotero, it's best to keep it short
  const truncatedCompleteQuery =
    completeQuery.length > QUERY_MAX_SIZE
      ? `${completeQuery.slice(0, QUERY_MAX_SIZE)}…`
      : completeQuery;

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
      .writeText(completeQuery)
      .then(() => {
        setCopyState("success");
      })
      .catch(() => {
        setCopyState("error");
      })
      .finally(openSnackbar);
  };

  return (
    <Container component="section" sx={{ pb: { xs: 3, sm: 1 } }}>
      <Paper
        elevation={0}
        sx={{
          bgcolor: "colors.veryLightBlue",
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <strong>{t("prefix")}</strong>
          <code title={truncatedCompleteQuery}>{truncatedCompleteQuery}</code>
        </Typography>
        <IconButton
          title={t("copy.label")}
          aria-label={t("copy.label")}
          onClick={handleCopy}
        >
          <CopyIcon />
        </IconButton>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
      >
        <Alert
          severity={copyState === "badEnv" ? "warning" : copyState}
          onClose={closeSnackbar}
        >
          {t(`copy.${copyState}`)}
        </Alert>
      </Snackbar>
    </Container>
  );
}
