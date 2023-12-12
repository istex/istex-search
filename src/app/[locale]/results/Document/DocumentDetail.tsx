"use client";

import { useTranslations } from "next-intl";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import {
  Chip,
  Drawer,
  Button as MuiButton,
  Stack,
  Typography,
} from "@mui/material";
import { useDocumentContext } from "./DocumentContext";
import FileList from "./FileList";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

const DocumentDetail: ClientComponent = () => {
  const { displayedDocument, closeDocument } = useDocumentContext();
  const t = useTranslations("results.Document");

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
    >
      <Stack direction={{ xs: "column", md: "row-reverse" }}>
        <Stack
          bgcolor="colors.lightBlue"
          p={7}
          width={{ xs: "100%", md: 330 }}
          minHeight="100vh"
          flexShrink={0}
          spacing={3}
        >
          <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
            <Typography
              variant="body2"
              sx={{ color: "colors.blue", fontWeight: 700 }}
            >
              {t("docInfos")}
            </Typography>
            {displayedDocument?.host?.genre != null && (
              <Chip
                label={displayedDocument.host.genre}
                variant="filled"
                size="small"
                sx={{ borderRadius: "3px" }}
              />
            )}
            {displayedDocument?.genre != null && (
              <Chip
                label={displayedDocument.genre}
                variant="filled"
                size="small"
                sx={{ borderRadius: "3px" }}
              />
            )}
            {displayedDocument?.corpusName != null && (
              <Chip
                label={displayedDocument.corpusName}
                variant="filled"
                size="small"
                sx={{ borderRadius: "3px" }}
              />
            )}
            {displayedDocument?.publicationDate != null && (
              <Chip
                label={displayedDocument.publicationDate}
                variant="filled"
                size="small"
                sx={{ borderRadius: "3px" }}
              />
            )}
            {displayedDocument?.arkIstex != null && (
              <Chip
                label={displayedDocument.arkIstex}
                variant="filled"
                size="small"
                sx={{ borderRadius: "3px" }}
              />
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
                <FileList files={displayedDocument.fulltext} />
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
                <FileList files={displayedDocument.metadata} />
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
                <FileList files={displayedDocument.annexes} />
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
                      extension: enrichment[0],
                      uri: enrichment[1].uri,
                    }),
                  )}
                />
              </>
            )}
          </Stack>
          <Button variant="outlined">{t("selectDocument")}</Button>
        </Stack>
        <Stack flexGrow={1} p={7}>
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
                mt: 2,
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
                mt: 3,
                color: "colors.grey",
              }}
            >
              {displayedDocument.abstract}
            </Typography>
          )}
          <Stack direction="row" justifyContent="space-between" mt={3}>
            <MuiButton
              variant="text"
              onClick={closeDocument}
              startIcon={<CloseIcon />}
              size="small"
              sx={{ color: "colors.lightBlack", textDecoration: "underline" }}
            >
              {t("backToResults")}
            </MuiButton>
            <MuiButton
              variant="text"
              startIcon={<ShareIcon />}
              size="small"
              sx={{ color: "colors.lightBlack", textDecoration: "underline" }}
            >
              {t("share")}
            </MuiButton>
          </Stack>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default DocumentDetail;
