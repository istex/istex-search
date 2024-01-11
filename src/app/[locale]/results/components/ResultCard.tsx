"use client";

import { useTranslations } from "next-intl";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SquareIcon from "@mui/icons-material/Square";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { lighten } from "@mui/system/colorManipulator";
import { useDocumentContext } from "../Document/DocumentContext";
import Button from "@/components/Button";
import type { Result } from "@/lib/istexApi";
import { lineclamp } from "@/lib/utils";
import { montserrat } from "@/mui/fonts";
import type { ClientComponent } from "@/types/next";

const ResultCard: ClientComponent<{ info: Result }> = ({ info }) => {
  const {
    displayDocument,
    toggleSelectedDocument,
    toggleExcludedDocument,
    selectedDocuments,
    excludedDocuments,
  } = useDocumentContext();
  const t = useTranslations("results.ResultsCard");

  const isSelected = selectedDocuments.includes(info.id);
  const isExcluded = excludedDocuments.includes(info.id);

  const cardColor = isSelected ? "darkGreen" : isExcluded ? "grey" : "blue";

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        height: "100%",
        bgcolor: lighten(theme.palette.colors[cardColor], 0.95),
        borderColor: theme.palette.colors[cardColor],
        display: "flex",
        flexDirection: "column",
      })}
    >
      <CardActionArea
        onClick={() => {
          displayDocument(info.id);
        }}
        sx={{
          flexGrow: 1,
        }}
      >
        <CardContent
          sx={{
            height: "100%",
          }}
        >
          <Typography
            component="div"
            sx={{
              fontFamily: montserrat.style.fontFamily,
              fontWeight: "bold",
              fontSize: "1.1rem",
              lineHeight: 1.4,
              ...lineclamp(3),
            }}
          >
            {info.title}
          </Typography>

          {info.host?.title != null && (
            <Typography
              variant="subtitle2"
              component="div"
              sx={{
                fontStyle: "italic",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "colors.grey",
                mb: 1,
              }}
            >
              {info.host.title}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              mb: 2,
            }}
          >
            {info.author
              ?.filter(({ name }) => name)
              .map(({ name }) => name)
              .join(", ")}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              color: "colors.grey",
              maxHeight: "10em",
              ...lineclamp(6),
            }}
          >
            {info.abstract}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Stack
        direction="row"
        sx={{
          "& .MuiButton-root": {
            width: "100%",
            flex: "1 1 0",
            borderRadius: 0,
            fontSize: "0.6875rem",
            px: 2,
            py: 2.5,
            borderBottom: "none",
            borderRight: "none",
            borderLeft: "none",
          },
          "& .MuiSvgIcon-root": {
            mr: 0.625,
            fontSize: "1rem",
          },
        }}
      >
        {excludedDocuments.length === 0 && (
          <Button
            mainColor={cardColor}
            onClick={() => {
              toggleSelectedDocument(info.id);
            }}
          >
            {isSelected ? <SquareOutlinedIcon /> : <SquareIcon />}
            {t(isSelected ? "unselect" : "select")}
          </Button>
        )}
        {selectedDocuments.length === 0 && (
          <Button
            mainColor={cardColor}
            variant={isExcluded ? "contained" : "outlined"}
            onClick={() => {
              toggleExcludedDocument(info.id);
            }}
          >
            {isExcluded ? <AddCircleIcon /> : <CancelIcon />}
            {t(isExcluded ? "include" : "exclude")}
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default ResultCard;
