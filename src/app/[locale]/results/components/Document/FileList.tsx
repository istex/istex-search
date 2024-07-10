import { useTranslations } from "next-intl";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  type SvgIconProps,
} from "@mui/material";
import BlankIcon from "./BlankIcon";
import BmpIcon from "./BmpIcon";
import GifIcon from "./GifIcon";
import JpegIcon from "./JpegIcon";
import JsonIcon from "./JsonIcon";
import ModsIcon from "./ModsIcon";
import PdfIcon from "./PdfIcon";
import PngIcon from "./PngIcon";
import TeiIcon from "./TeiIcon";
import TiffIcon from "./TiffIcon";
import TxtIcon from "./TxtIcon";
import XmlIcon from "./XmlIcon";
import ZipIcon from "./ZipIcon";

interface FileListProps {
  files: { key?: string; extension: string; uri: string }[];
  titleKey: string;
}

export default function FileList({ files, titleKey }: FileListProps) {
  const t = useTranslations("results.Document");

  return (
    <Box sx={{ fontSize: "0.8rem" }}>
      <Typography
        component="h4"
        variant="subtitle2"
        sx={{
          fontSize: "inherit",
        }}
      >
        {t(titleKey)}
      </Typography>
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
    </Box>
  );
}

function getIcon(extension: string, props: SvgIconProps) {
  let Component;

  switch (extension) {
    case "pdf":
      Component = PdfIcon;
      break;
    case "zip":
      Component = ZipIcon;
      break;
    case "tei":
      Component = TeiIcon;
      break;
    case "txt":
    case "cleaned":
      Component = TxtIcon;
      break;
    case "xml":
      Component = XmlIcon;
      break;
    case "mods":
      Component = ModsIcon;
      break;
    case "json":
      Component = JsonIcon;
      break;
    case "jpeg":
      Component = JpegIcon;
      break;
    case "png":
      Component = PngIcon;
      break;
    case "bmp":
      Component = BmpIcon;
      break;
    case "gif":
      Component = GifIcon;
      break;
    case "tiff":
      Component = TiffIcon;
      break;
    default:
      Component = BlankIcon;
  }

  return <Component {...props} />;
}
