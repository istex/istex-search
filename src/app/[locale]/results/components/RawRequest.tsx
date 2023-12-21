"use client";

import { useTranslations } from "next-intl";
import { Box, Container, Link, Paper, Typography } from "@mui/material";
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
  const resultsApiUrl = buildResultPreviewUrl({
    queryString,
    perPage,
    page,
    filters,
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

const highlightColors = ["#6F1B84", "colors.blue", "#4BBC2E"];

const HighlightedUrl: ClientComponent<{ url: URL }> = ({ url }) => {
  const searchParams: string[][] = [];

  url.searchParams.forEach((value, name) => {
    searchParams.push([name, value]);
  });

  return (
    <>
      {url.origin}
      {url.pathname}?
      {searchParams.map(([name, value], i) => (
        <Box
          key={name}
          component="span"
          sx={{
            fontWeight: "bold",
            color: highlightColors[i % highlightColors.length],
          }}
        >
          {i !== 0 ? "&" : ""}
          {encodeURIComponent(name)}={encodeURIComponent(value)}
        </Box>
      ))}
    </>
  );
};

export default RawRequest;
