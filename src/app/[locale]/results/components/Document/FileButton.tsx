import { IconButton, type SvgIconProps, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type * as React from "react";
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

export interface FileButtonProps {
  category: string;
  labelOverride?: string;
  extension: string;
  uri: URL;
}

export default function FileButton({
  category,
  labelOverride,
  extension,
  uri,
}: FileButtonProps) {
  const t = useTranslations("results.Document");
  const label = t(`formatLinks.${labelOverride ?? category}`, {
    extension: extension.toUpperCase(),
  });

  return (
    <FileButtonRoot href={uri.href} label={label}>
      {getIcon(extension)}
      <FileButtonLabel>{labelOverride ?? extension}</FileButtonLabel>
    </FileButtonRoot>
  );
}

export interface FileButtonRootProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

export function FileButtonRoot({ href, label, children }: FileButtonRootProps) {
  return (
    <IconButton
      href={href}
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
      {children}
    </IconButton>
  );
}

export function FileButtonLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{
        textTransform: "lowercase",
        fontSize: "0.7rem",
        color: "colors.blue",
        maxHeight: "1rem",
      }}
    >
      {children}
    </Typography>
  );
}

function getIcon(extension: string) {
  let Component: (props: SvgIconProps) => React.ReactNode;

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

  return <Component sx={{ fontSize: "1.5rem" }} />;
}
