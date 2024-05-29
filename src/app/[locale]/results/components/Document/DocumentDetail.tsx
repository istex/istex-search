import { useTranslations } from "next-intl";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import { Chip, Drawer, Stack, Typography } from "@mui/material";
import FileList from "./FileList";
import Button from "@/components/Button";
import { useDocumentContext } from "@/contexts/DocumentContext";

export default function DocumentDetail() {
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

  const isSelected =
    displayedDocument != null
      ? selectedDocuments.some(
          (doc) => doc.arkIstex === displayedDocument.arkIstex,
        )
      : false;
  const isExcluded =
    displayedDocument != null
      ? excludedDocuments.includes(displayedDocument.arkIstex)
      : false;

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
          width: {
            xs: "100%",
            md: "70%",
          },
          "@media (min-width:3000px)": {
            whidth: "50%",
          },
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
          <Stack
            direction="row"
            justifyContent="space-between"
            mt={2}
            sx={{
              fontSize: "0.6875rem",
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            <Typography
              component="span"
              onClick={closeDocument}
              sx={{
                font: "inherit",
                color: "colors.lightBlack",
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <CloseIcon fontSize="small" />
              {t("backToResults")}
            </Typography>
            <Typography
              component="span"
              sx={{
                font: "inherit",
                color: "colors.lightBlack",
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <ShareIcon fontSize="small" />
              {t("share")}
            </Typography>
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
              component="h3"
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
                sx={{
                  borderRadius: "3px",
                  backgroundColor: "colors.variantBlue",
                }}
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
                    sx={{
                      borderRadius: "3px",
                      backgroundColor: "colors.variantBlue",
                    }}
                    title={tTags(tag)}
                    color="info"
                  />
                ),
            )}
          </Stack>
          <Stack spacing={1} alignItems="start">
            <Typography
              component="h3"
              variant="body2"
              sx={{ color: "colors.blue", fontWeight: 700 }}
              mt={4}
            >
              {t("seeDoc")}
            </Typography>
            {displayedDocument?.fulltext != null && (
              <>
                <Typography
                  component="h4"
                  variant="subtitle2"
                  sx={{
                    fontSize: "0.8rem",
                  }}
                >
                  {t("fulltext")}
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
                  component="h4"
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
                  component="h4"
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
                  component="h4"
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
                variant={isSelected ? "contained" : "outlined"}
                mainColor={isSelected ? "darkGreen" : undefined}
                size="small"
                disabled={excludedDocuments.length > 0}
                startIcon={
                  isSelected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />
                }
                onClick={() => {
                  toggleSelectedDocument(displayedDocument.arkIstex);
                }}
              >
                {t(isSelected ? "unselectDocument" : "selectDocument")}
              </Button>
              <Button
                variant={isExcluded ? "contained" : "outlined"}
                mainColor={isExcluded ? "grey" : undefined}
                size="small"
                disabled={selectedDocuments.length > 0}
                startIcon={isExcluded ? <AddCircleIcon /> : <CancelIcon />}
                onClick={() => {
                  toggleExcludedDocument(displayedDocument.arkIstex);
                }}
              >
                {t(isExcluded ? "includeDocument" : "excludeDocument")}
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
}
