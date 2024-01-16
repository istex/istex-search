"use client";

import { useTranslations } from "next-intl";
import { Container, Link, Paper, Typography } from "@mui/material";
import HighlightedUrl from "./HighlightedUrl";
import { useQueryContext } from "@/contexts/QueryContext";
import { buildResultPreviewUrl } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const RawRequest: ClientComponent = () => {
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
        })}
      >
        <Typography
          variant="body2"
          sx={{
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
      </Paper>
    </Container>
  );
};

export default RawRequest;
