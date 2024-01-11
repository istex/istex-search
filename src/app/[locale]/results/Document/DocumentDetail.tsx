"use client";

import { useTranslations } from "next-intl";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import { Chip, Drawer, Link, Stack, Typography } from "@mui/material";
import { useDocumentContext } from "./DocumentContext";
import FileList from "./FileList";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

const DocumentDetail: ClientComponent = () => {
  const {
    displayedDocument,
    closeDocument,
    toggleSelectedDocument,
    toggleExcludedDocument,
    selectedDocuments,
    excludedDocuments,
  } = useDocumentContext();
  const t = useTranslations("results.Document");
  const tTags = useTranslations("results.Document.tags");

  const tags = ["genre", "corpusName", "publicationDate", "arkIstex"] as const;

  return (
    <Drawer
      anchor="right"
      open={displayedDocument != null}
      onClose={closeDocument}
      sx={{
        backdropFilter: "blur(5px)",
      }}
      PaperProps={{
        sx: {
          width: { xs: "100%", md: "70%" },
        },
      }}
      transitionDuration={400}
    >
      <Stack direction={{ xs: "column", md: "row" }}>
        <Stack flexGrow={1} p={{ xs: 7, md: 4, lg: 7 }} gap={0.5}>
          {displayedDocument?.title != null && (
            <Typography variant="h6" component="h2" color="common.black">
              {displayedDocument.title}
            </Typography>
          )}
          {displayedDocument?.host?.title != null && (
            <Typography
              variant="subtitle2"
              component="div"
              sx={{
                fontStyle: "italic",
                color: "colors.grey",
              }}
            >
              {displayedDocument.host.title}
            </Typography>
          )}
          {displayedDocument?.author != null && (
            <Typography
              variant="body2"
              sx={{
                color: "colors.blue",
              }}
            >
              {displayedDocument.author
                .filter(({ name }) => name)
                .map(({ name }) => name)
                .join(", ")}
            </Typography>
          )}
          {displayedDocument?.abstract != null && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: "colors.grey",
              }}
            >
              {displayedDocument.abstract}
            </Typography>
          )}
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Link
              onClick={closeDocument}
              sx={{
                color: "colors.lightBlack",
                fontWeight: 700,
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CloseIcon fontSize="small" />
              {t("backToResults")}
            </Link>
            <Link
              sx={{
                color: "colors.lightBlack",
                fontWeight: 700,
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <ShareIcon fontSize="small" />
              {t("share")}
            </Link>
          </Stack>
        </Stack>
        <Stack
          bgcolor="colors.lightBlue"
          p={{ xs: 7, md: 4, lg: 7 }}
          width={{ xs: "100%", md: 240, lg: 360 }}
          minHeight={{ xs: "unset", md: "100vh" }}
          flexShrink={0}
          spacing={3}
        >
          <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
            <Typography
              variant="body2"
              sx={{ color: "colors.blue", fontWeight: 700, width: "100%" }}
            >
              {t("docInfos")}
            </Typography>
            {displayedDocument?.host?.genre != null && (
              <Chip
                label={displayedDocument.host.genre}
                variant="filled"
                size="small"
                sx={{ borderRadius: "3px" }}
                title={tTags("hostGenre")}
                color="info"
              />
            )}
            {tags.map(
              (tag) =>
                displayedDocument?.[tag] != null && (
                  <Chip
                    key={tag}
                    label={displayedDocument[tag]}
                    variant="filled"
                    size="small"
                    sx={{ borderRadius: "3px" }}
                    title={tTags(tag)}
                    color="info"
                  />
                ),
            )}
          </Stack>
          <Stack spacing={1} alignItems="start">
            <Typography
              variant="body2"
              sx={{ color: "colors.blue", fontWeight: 700 }}
              mt={4}
            >
              {t("seeDoc")}
            </Typography>
            {displayedDocument?.fulltext != null && (
              <>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: "0.8rem",
                  }}
                >
                  {t("fullText")}
                </Typography>
                <FileList
                  files={displayedDocument.fulltext}
                  titleKey="fulltext"
                />
              </>
            )}
            {displayedDocument?.metadata != null && (
              <>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: "0.8rem",
                  }}
                >
                  {t("metadata")}
                </Typography>
                <FileList
                  files={displayedDocument.metadata}
                  titleKey="metadata"
                />
              </>
            )}

            {displayedDocument?.annexes != null && (
              <>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: "0.8rem",
                  }}
                >
                  {t("annexes")}
                </Typography>
                <FileList
                  files={displayedDocument.annexes}
                  titleKey="annexes"
                />
              </>
            )}
            {displayedDocument?.enrichments != null && (
              <>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: "0.8rem",
                  }}
                >
                  {t("enrichments")}
                </Typography>
                <FileList
                  files={Object.entries(displayedDocument.enrichments).map(
                    (enrichment) => ({
                      key: enrichment[0],
                      extension: enrichment[1][0].extension,
                      uri: enrichment[1][0].uri,
                    }),
                  )}
                  titleKey="enrichments"
                />
              </>
            )}
          </Stack>
          {displayedDocument != null && (
            <>
              <Button
                variant="outlined"
                disabled={excludedDocuments.length > 0}
                onClick={() => {
                  toggleSelectedDocument(displayedDocument.id);
                }}
              >
                {t(
                  selectedDocuments.includes(displayedDocument.id)
                    ? "unselectDocument"
                    : "selectDocument",
                )}
              </Button>
              <Button
                variant="outlined"
                disabled={selectedDocuments.length > 0}
                onClick={() => {
                  toggleExcludedDocument(displayedDocument.id);
                }}
              >
                {t(
                  excludedDocuments.includes(displayedDocument.id)
                    ? "includeDocument"
                    : "excludeDocument",
                )}
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default DocumentDetail;
