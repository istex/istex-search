import * as React from "react";
import { useTranslations } from "next-intl";
import { IconButton, SvgIcon, Typography } from "@mui/material";
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
import OpenAccessIcon from "@/../public/open-access.svg?svgr";

export interface FileButtonProps {
  category: string;
  enrichmentName: string | null;
  extension: string;
  uri: URL;
}

export default function FileButton({
  category,
  enrichmentName,
  extension,
  uri,
}: FileButtonProps) {
  const t = useTranslations("results.Document");
  const label = t(`formatsLinks.${enrichmentName ?? category}`, {
    extension: extension.toUpperCase(),
  });

  return (
    <IconButton
      href={uri.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      disableRipple
      title={label}
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
      {getIcon(extension)}
      {extension !== "openAccess" && (
        <Typography
          variant="caption"
          sx={{
            textTransform: "lowercase",
            fontSize: "0.7rem",
            color: "colors.blue",
            maxHeight: "1rem",
          }}
        >
          {enrichmentName ?? extension}
        </Typography>
      )}
    </IconButton>
  );
}

function getIcon(extension: string) {
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
    case "openAccess":
      return <SvgIcon htmlColor="#f68212" component={OpenAccessIcon} />;
    default:
      Component = BlankIcon;
  }

  return <Component sx={{ fontSize: "1.5rem" }} />;
}
