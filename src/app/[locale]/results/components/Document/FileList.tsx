import { useTranslations } from "next-intl";
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
  IconButton,
  Stack,
  Typography,
  type SvgIconProps,
} from "@mui/material";
import JsonIcon from "./JsonIcon";
import ModsIcon from "./ModsIcon";
import PdfIcon from "./PdfIcon";
import TeiIcon from "./TeiIcon";
import TxtIcon from "./TxtIcon";
import XmlIcon from "./XmlIcon";
import ZipIcon from "./ZipIcon";

interface FileListProps {
  files: { key?: string; extension: string; uri: string }[];
  titleKey: string;
}

export default function FileList({ files, titleKey }: FileListProps) {
  const t = useTranslations("results.Document.formatsLinks");

  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {files.map(({ key, extension, uri }, index) => {
        const fullUri = new URL(uri);
        fullUri.searchParams.set("sid", "istex-search");

        return (
          <IconButton
            href={fullUri.toString()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={key ?? extension}
            key={index}
            disableRipple
            title={t(titleKey, { key, extension })}
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "colors.veryLightBlue",
              borderRadius: 1,
              p: 0.5,
              "&:hover": {
                color: "colors.blue",
              },
            }}
          >
            {getIcon(extension, {
              sx: { fontSize: "2.2rem", filter: "grayscale(100%);" },
            })}
            <Typography
              variant="caption"
              sx={{ textTransform: "uppercase", fontSize: "0.7rem" }}
            >
              {key ?? extension}
            </Typography>
          </IconButton>
        );
      })}
    </Stack>
  );
}

function getIcon(extension: string, props: SvgIconProps) {
  switch (extension) {
    case "pdf":
      return <PdfIcon {...props} />;
    case "zip":
      return <ZipIcon {...props} />;
    case "tei":
      return <TeiIcon {...props} />;
    case "txt":
      return <TxtIcon {...props} />;
    case "xml":
      return <XmlIcon {...props} />;
    case "mods":
      return <ModsIcon {...props} />;
    case "json":
      return <JsonIcon {...props} />;
    default:
      return <FileIcon {...props} />;
  }
}
