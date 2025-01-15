import { useTranslations } from "next-intl";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { lighten } from "@mui/material/styles";
import FileList from "./Document/FileList";
import Button from "@/components/Button";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { useSearchParams } from "@/lib/hooks";
import { lineclamp } from "@/lib/utils";
import { montserrat } from "@/mui/fonts";

interface ResultCardProps {
  index: number;
  displayIcons?: boolean;
}

export default function ResultCard({ index, displayIcons }: ResultCardProps) {
  const {
    displayDocument,
    toggleSelectedDocument,
    toggleExcludedDocument,
    selectedDocuments,
    excludedDocuments,
  } = useDocumentContext();
  const { results } = useQueryContext();
  const t = useTranslations("results.ResultsCard");
  const searchParams = useSearchParams();
  const isImportSearchMode = searchParams.getSearchMode() === "import";
  const document = results.hits[index];

  const isSelected = selectedDocuments.some(
    (doc) => doc.arkIstex === document.arkIstex,
  );
  const isExcluded = excludedDocuments.includes(document.arkIstex);

  const cardColor = isSelected ? "darkGreen" : isExcluded ? "grey" : "blue";

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        height: "100%",
        bgcolor: lighten(theme.palette.colors[cardColor], 0.95),
        borderColor: theme.vars.palette.colors[cardColor],
        display: "flex",
        flexDirection: "column",
      })}
    >
      <CardContent
        sx={{
          height: "100%",
        }}
      >
        <CardActionArea
          onClick={() => {
            displayDocument(index);
          }}
          sx={{
            flexGrow: 1,
            borderRadius: 1.5,
          }}
        >
          {/* Title */}
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
            {document.title}
          </Typography>

          {/* Host title */}
          {document.host?.title != null && (
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
              {document.host.title}
            </Typography>
          )}

          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", gap: 3 }}
          >
            {/* Author names */}
            <Typography
              component="div"
              variant="body2"
              sx={{
                color: "colors.blue",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mb: 2,
              }}
            >
              {document.author
                ?.filter(({ name }) => name != null && name !== "")
                .map(({ name }) => name)
                .join(", ")}
            </Typography>

            {/* Publication date */}
            <Typography
              component="div"
              variant="subtitle2"
              sx={{
                color: "colors.grey",
              }}
            >
              {document.publicationDate}
            </Typography>
          </Stack>

          {/* Abstract */}
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              color: "colors.grey",
              maxHeight: "10em",
              mb: 1,
              ...lineclamp(3),
            }}
          >
            {document.abstract}
          </Typography>
        </CardActionArea>

        {displayIcons === true && (
          <FileList document={document} direction="row" gap={2} />
        )}
      </CardContent>
      <Stack
        direction="row"
        sx={{
          "& .MuiButton-root": {
            flex: "1 1 0",
            borderRadius: 0,
            fontSize: "0.75rem",
          },
          "& .MuiSvgIcon-root": {
            mr: 0.625,
            fontSize: "1rem",
          },
          backgroundColor: "#FFFFFF",
        }}
      >
        {excludedDocuments.length === 0 && (
          <Button
            variant={isSelected ? "contained" : "text"}
            mainColor={isSelected ? "darkGreen" : undefined}
            size="small"
            disabled={isImportSearchMode}
            onClick={() => {
              toggleSelectedDocument(document.arkIstex);
            }}
          >
            {isSelected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
            {t(isSelected ? "unselect" : "select")}
          </Button>
        )}
        {excludedDocuments.length === 0 && selectedDocuments.length === 0 && (
          <Divider orientation="vertical" variant="fullWidth" flexItem />
        )}
        {selectedDocuments.length === 0 && (
          <Button
            variant={isExcluded ? "contained" : "text"}
            mainColor={isExcluded ? "grey" : undefined}
            size="small"
            disabled={isImportSearchMode}
            onClick={() => {
              toggleExcludedDocument(document.arkIstex);
            }}
          >
            {isExcluded ? <AddCircleIcon /> : <CancelIcon />}
            {t(isExcluded ? "include" : "exclude")}
          </Button>
        )}
      </Stack>
    </Card>
  );
}
