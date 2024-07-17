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
import { lighten } from "@mui/system/colorManipulator";
import FileList from "./Document/FileList";
import Button from "@/components/Button";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useSearchParams } from "@/lib/hooks";
import type { Result } from "@/lib/istexApi";
import { lineclamp } from "@/lib/utils";
import { montserrat } from "@/mui/fonts";

interface ResultCardProps {
  info: Result;
  displayIcons?: boolean;
}

export default function ResultCard({ info, displayIcons }: ResultCardProps) {
  const {
    displayDocument,
    toggleSelectedDocument,
    toggleExcludedDocument,
    selectedDocuments,
    excludedDocuments,
  } = useDocumentContext();
  const t = useTranslations("results.ResultsCard");
  const searchParams = useSearchParams();
  const isImportSearchMode = searchParams.getSearchMode() === "import";

  const isSelected = selectedDocuments.some(
    (doc) => doc.arkIstex === info.arkIstex,
  );
  const isExcluded = excludedDocuments.includes(info.arkIstex);

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
      <CardContent
        sx={{
          height: "100%",
        }}
      >
        <CardActionArea
          onClick={() => {
            displayDocument(info.id);
          }}
          sx={{
            flexGrow: 1,
            borderRadius: 1.5,
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
              mb: 1,
              ...lineclamp(6),
            }}
          >
            {info.abstract}
          </Typography>
        </CardActionArea>

        {displayIcons === true && (
          <FileList document={info} direction="row" gap={2} />
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
              toggleSelectedDocument(info.arkIstex);
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
              toggleExcludedDocument(info.arkIstex);
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
