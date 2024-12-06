"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import CopyIcon from "@mui/icons-material/ContentCopy";
import {
  Alert,
  Container,
  IconButton,
  Link,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import HighlightedUrl from "./HighlightedUrl";
import { useQueryContext } from "@/contexts/QueryContext";
import { useSearchParams } from "@/lib/hooks";
import { buildResultPreviewUrl } from "@/lib/istexApi";

export default function RawRequest() {
  const t = useTranslations("results.RawRequest");
  const searchParams = useSearchParams();
  const { queryString, randomSeed } = useQueryContext();
  const perPage = searchParams.getPerPage();
  const filters = searchParams.getFilters();
  const page = searchParams.getPage();
  const sortBy = searchParams.getSortBy();
  const sortDir = searchParams.getSortDirection();
  const resultsApiUrl = buildResultPreviewUrl({
    queryString,
    perPage,
    page,
    filters,
    sortBy,
    sortDir,
    randomSeed,
  });
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
      .writeText(resultsApiUrl.toString())
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
          <Link
            href={resultsApiUrl.toString()}
            target="_blank"
            rel="noreferrer"
          >
            <HighlightedUrl url={resultsApiUrl} />
          </Link>
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
