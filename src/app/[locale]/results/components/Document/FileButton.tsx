import * as React from "react";
import { useTranslations } from "next-intl";
import { IconButton, Popover, Typography } from "@mui/material";
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
import { externalLink } from "@/i18n/i18n";
import { getExternalPdfUrl, type Result } from "@/lib/istexApi";

interface FileButtonProps {
  document: Result;
  category: string;
  enrichmentName: string | null;
  extension: string;
  uri: URL;
}

export default function FileButton({
  document,
  category,
  enrichmentName,
  extension,
  uri,
}: FileButtonProps) {
  const t = useTranslations("results.Document");
  const externalPdfUrl = getExternalPdfUrl(document);

  if (extension === "pdf" && externalPdfUrl != null) {
    return (
      <PdfFileButton externalUrl={externalPdfUrl} istexUrl={new URL(uri)} />
    );
  }

  return (
    <IconButton
      href={uri.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={enrichmentName ?? extension}
      disableRipple
      title={t(`formatsLinks.${category}`, {
        key:
          enrichmentName != null
            ? t(`enrichmentNames.${enrichmentName}`)
            : undefined,
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
      {getIcon(extension)}
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
    </IconButton>
  );
}

interface PdfFileButtonProps {
  externalUrl: URL;
  istexUrl: URL;
}

function PdfFileButton({ externalUrl, istexUrl }: PdfFileButtonProps) {
  const t = useTranslations("results.Document");
  const [popoverAnchorEl, setPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const popoverOpen = Boolean(popoverAnchorEl);
  const popoverId = popoverOpen ? "pdf-popover" : undefined;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setPopoverAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="pdf"
        aria-describedby={popoverId}
        disableRipple
        title={t("formatsLinks.fulltext", {
          extension: "PDF",
        })}
        onClick={handleClick}
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
        {getIcon("pdf")}
        <Typography
          variant="caption"
          sx={{
            textTransform: "lowercase",
            fontSize: "0.7rem",
            color: "colors.blue",
            maxHeight: "1rem",
          }}
        >
          pdf
        </Typography>
      </IconButton>

      <Popover
        id={popoverId}
        elevation={5}
        open={popoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography sx={{ p: 2 }} variant="body2">
          {t.rich("pdfPopover", {
            externalLink: externalLink(externalUrl.href),
            istexLink: externalLink(istexUrl.href),
          })}
        </Typography>
      </Popover>
    </>
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
    default:
      Component = BlankIcon;
  }

  return <Component sx={{ fontSize: "1.5rem" }} />;
}
