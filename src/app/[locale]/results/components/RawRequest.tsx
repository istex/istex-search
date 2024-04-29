"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Alert,
  Box,
  Container,
  IconButton,
  Link,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import HighlightedUrl from "./HighlightedUrl";
import CopyLogo from "@/../public/copy-icon.svg";
import { useQueryContext } from "@/contexts/QueryContext";
import { buildResultPreviewUrl } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const RawRequest: ClientComponent = () => {
  const t = useTranslations("results.RawRequest");
  const searchParams = useSearchParams();
  const { queryString, randomSeed } = useQueryContext();
  const perPage = searchParams.getPerPage();
  const page = searchParams.getPage();
  const filters = searchParams.getFilters();
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
    if (navigator.clipboard == null || !window.isSecureContext) {
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
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          textAlign="center"
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
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            fontSize: "0.4375rem",
            color: theme.palette.colors.darkBlack,
            whiteSpace: "nowrap",
          })}
        >
          <IconButton
            sx={{
              backgroundColor: "white",
              borderRadius: "100%",
              mb: "0.12rem",
            }}
            onClick={handleCopy}
          >
            <Image src={CopyLogo} alt="" />
          </IconButton>
          {t("copy.button")}
        </Box>
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
};

export default RawRequest;
