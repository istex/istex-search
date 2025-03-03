import { useTranslations } from "next-intl";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ShareIcon from "@mui/icons-material/Share";
import { Chip, Drawer, IconButton, Stack, Typography } from "@mui/material";
import FileList from "./FileList";
import Button from "@/components/Button";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { useShare } from "@/lib/hooks";

const tags = ["genre", "corpusName", "publicationDate", "arkIstex"] as const;

export default function DocumentDetail() {
  const {
    displayedDocumentIndex,
    displayDocument,
    closeDocument,
    toggleSelectedDocument,
    toggleExcludedDocument,
    selectedDocuments,
    excludedDocuments,
  } = useDocumentContext();
  const { results } = useQueryContext();
  const t = useTranslations("results.Document");
  const tFields = useTranslations("fields");
  const share = useShare();
  const displayedDocument =
    displayedDocumentIndex !== -1 ? results.hits[displayedDocumentIndex] : null;

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

  const shareDocument = () => {
    if (displayedDocument == null) {
      return;
    }

    const url = new URL(window.location.href);
    url.search = `?q=${encodeURIComponent(`arkIstex.raw:"${displayedDocument.arkIstex}"`)}`;

    share("document", url);
  };

  const displayPreviousDocument = () => {
    displayDocument(displayedDocumentIndex - 1);
  };

  const displayNextDocument = () => {
    displayDocument(displayedDocumentIndex + 1);
  };

  return (
    <Drawer
      anchor="right"
      open={displayedDocument != null}
      onClose={closeDocument}
      sx={{
        backdropFilter: "blur(5px)",
      }}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              md: "70%",
            },
          },
        },
      }}
      transitionDuration={400}
    >
      <Stack direction={{ xs: "column", md: "row" }}>
        {/* Left panel */}
        <Stack
          sx={{
            flexGrow: 1,
            p: { xs: 7, md: 4, lg: 7 },
            gap: 0.5,
          }}
        >
          {displayedDocument?.title != null && (
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: "common.black",
              }}
            >
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
                .filter(({ name }) => name != null && name !== "")
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

          {/* Go back and share buttons */}
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              mt: 2,
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
              onClick={shareDocument}
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

          {/* Previous and next buttons */}
          <Stack
            direction="row"
            sx={{ mt: "auto", pt: 2, justifyContent: "space-between" }}
          >
            <IconButton
              color="inherit"
              aria-label={t("previousButtonLabel")}
              title={t("previousButtonLabel")}
              disabled={
                displayedDocument == null || displayedDocumentIndex === 0
              }
              onClick={displayPreviousDocument}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label={t("nextButtonLabel")}
              title={t("nextButtonLabel")}
              disabled={
                displayedDocument == null ||
                displayedDocumentIndex === results.hits.length - 1
              }
              onClick={displayNextDocument}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Right panel */}
        <Stack
          spacing={3}
          sx={{
            bgcolor: "colors.lightBlue",
            p: { xs: 7, md: 4, lg: 7 },
            width: { xs: "100%", md: 240, lg: 360 },
            minHeight: { xs: "unset", md: "100vh" },
            flexShrink: 0,
          }}
        >
          {/* Tags */}
          <Stack
            spacing={1}
            direction="row"
            useFlexGap
            sx={{
              flexWrap: "wrap",
            }}
          >
            <Typography
              component="h3"
              variant="body2"
              sx={{ color: "colors.blue", fontWeight: 700, width: "100%" }}
            >
              {t("docInfos")}
            </Typography>
            {displayedDocument?.host?.genre != null && (
              <Chip
                label={displayedDocument.host.genre.join(" & ")}
                variant="filled"
                size="small"
                sx={{
                  borderRadius: "3px",
                  backgroundColor: "colors.variantBlue",
                }}
                title={tFields("host.genre.title")}
                color="info"
              />
            )}
            {tags.map(
              (tag) =>
                displayedDocument?.[tag] != null && (
                  <Chip
                    key={tag}
                    label={
                      Array.isArray(displayedDocument[tag])
                        ? displayedDocument[tag].join(" & ")
                        : displayedDocument[tag]
                    }
                    variant="filled"
                    size="small"
                    sx={{
                      borderRadius: "3px",
                      backgroundColor: "colors.variantBlue",
                    }}
                    title={tFields(`${tag}.title`)}
                    color="info"
                  />
                ),
            )}
          </Stack>

          {/* File lists */}
          <Stack
            spacing={1}
            sx={{
              alignItems: "start",
            }}
          >
            <Typography
              component="h3"
              variant="body2"
              sx={{
                mt: 4,
                color: "colors.blue",
                fontWeight: 700,
              }}
            >
              {t("seeDoc")}
            </Typography>
            {displayedDocument != null && (
              <FileList document={displayedDocument} gap={1} />
            )}
          </Stack>

          {/* Select and exclude buttons */}
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
