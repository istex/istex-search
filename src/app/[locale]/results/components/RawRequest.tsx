"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
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
  const [snackbarOpen, setSnackbarOpen] = useState<
    undefined | "success" | "error"
  >(undefined);
  const t = useTranslations("results.RawRequest");
  const searchParams = useSearchParams();
  const { queryString } = useQueryContext();
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
  });

  return (
    <Container component="section" sx={{ pb: { xs: 3, sm: 1 } }}>
      <Paper
        elevation={0}
        sx={(theme) => ({
          bgcolor: "colors.veryLightBlue",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        })}
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
            onClick={() => {
              navigator.clipboard
                .writeText(resultsApiUrl.toString())
                .then(() => {
                  setSnackbarOpen("success");
                })
                .catch(() => {
                  setSnackbarOpen("error");
                });
            }}
          >
            <Image src={CopyLogo} alt="copy-request" />
          </IconButton>
          {t("copyButton")}
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen !== undefined}
        autoHideDuration={5000}
        onClose={() => {
          setSnackbarOpen(undefined);
        }}
        message={snackbarOpen === "success" ? t("copySuccess") : t("copyError")}
      />
    </Container>
  );
};

export default RawRequest;
