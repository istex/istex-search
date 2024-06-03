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

export interface FileListProps {
  files: { key?: string; extension: string; uri: string }[];
  titleKey: string;
}

export default function FileList({ files, titleKey }: FileListProps) {
  const t = useTranslations("results.Document");

  return (
    <Stack direction="row" flexWrap="wrap" gap={0.5}>
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
            title={t(`formatsLinks.${titleKey}`, {
              key: key != null ? t(`enrichmentNames.${key}`) : undefined,
              extension: extension.toUpperCase(),
            })}
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 0.5,
              maxWidth: "4rem",
              overflow: "hidden",
              wordBreak: "break-all",
              borderRadius: 0,
            }}
          >
            {getIcon(extension, {
              sx: { fontSize: "1.5rem" },
            })}
            <Typography
              variant="caption"
              sx={{
                textTransform: "lowercase",
                fontSize: "0.7rem",
                color: "colors.blue",
                maxHeight: "1rem",
              }}
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
