import { Fragment } from "react";
import { useTranslations } from "next-intl";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, IconButton, Typography } from "@mui/material";
import Panel from "./Panel";
import PanelTitle from "./PanelTitle";
import { useDocumentContext } from "@/contexts/DocumentContext";
import type { ClientComponent } from "@/types/next";

const SelectedDocPanel: ClientComponent = () => {
  const t = useTranslations("download.SelectedDoc");
  const { selectedDocuments, toggleSelectedDocument } = useDocumentContext();

  return (
    <Panel>
      <PanelTitle>{t("title")}</PanelTitle>
      <Box
        display="grid"
        gridTemplateColumns="auto 1fr auto"
        alignItems="stretch"
        maxHeight={470}
        overflow="auto"
        sx={{
          "& > *:nth-child(6n+1), & > *:nth-child(6n+2), & > *:nth-child(6n+3)":
            {
              bgcolor: "colors.white",
            },
        }}
      >
        {selectedDocuments.map((doc, index) => (
          <Fragment key={doc.arkIstex}>
            <Typography
              variant="body2"
              px={1}
              display="flex"
              alignItems="center"
              sx={(theme) => ({
                color: theme.palette.colors.grey,
              })}
            >
              {index + 1}
            </Typography>
            <Box display="flex" alignItems="center" overflow="hidden">
              <Typography
                variant="body2"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {doc.title ?? t("noDocTitle")}
              </Typography>
            </Box>
            <IconButton
              edge="end"
              aria-label={t("unselect")}
              title={t("unselect")}
              onClick={() => {
                toggleSelectedDocument(doc.arkIstex);
              }}
              color="primary"
              disableRipple
              sx={{
                mr: 0,
                borderRadius: 0,
                p: 0.5,
              }}
            >
              <CancelIcon
                sx={{
                  width: "14px",
                  height: "14px",
                }}
              />
            </IconButton>
          </Fragment>
        ))}
      </Box>
    </Panel>
  );
};

export default SelectedDocPanel;
