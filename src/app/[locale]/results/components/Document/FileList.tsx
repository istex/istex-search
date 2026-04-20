import { Box, Stack, type StackProps } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type * as React from "react";
import IstexViewIcon from "@/../public/istex-view.svg";
import OpenAccessIcon from "@/../public/open-access.svg";
import Badge from "@/components/Badge";
import { getExternalPdfUrl, type Result } from "@/lib/istexApi";
import { FileButtonRoot } from "./FileButton";
import FileListCategory, {
  FileListCategoryHeader,
  type FileListCategoryProps,
  FileListCategoryRoot,
} from "./FileListCategory";

interface FileListProps {
  document: Result;
  direction?: StackProps["direction"];
  gap?: React.CSSProperties["gap"];
}

export default function FileList({ document, direction, gap }: FileListProps) {
  const t = useTranslations("results.Document");
  const externalPdfUrl = getExternalPdfUrl(document);
  const istexViewUrl = new URL("https://view.istex.fr");
  istexViewUrl.hash = encodeURIComponent(document.arkIstex);

  const enrichmentsInfo: FileListCategoryProps["files"] | null =
    document.enrichments != null
      ? Object.entries(document.enrichments).map(([enrichmentName, files]) => ({
          labelOverride: enrichmentName,
          extension: files[0].extension,
          uri: files[0].uri,
        }))
      : null;

  return (
    <Stack
      direction={direction}
      sx={{
        gap,
      }}
    >
      {document.fulltext != null && (
        <FileListCategory category="fulltext" files={document.fulltext} />
      )}
      {document.metadata != null && (
        <FileListCategory category="metadata" files={document.metadata} />
      )}
      {document.annexes != null && (
        <FileListCategory category="annexes" files={document.annexes} />
      )}
      {enrichmentsInfo != null && (
        <FileListCategory category="enrichments" files={enrichmentsInfo} />
      )}

      <FileListCategoryRoot>
        <FileListCategoryHeader>
          {t("istexView")}{" "}
          <Badge label={t("istexViewNewChip")} severity="success" />
        </FileListCategoryHeader>
        <Box sx={{ display: "flex" }}>
          <FileButtonRoot
            href={istexViewUrl.href}
            label={t("formatLinks.istexView")}
          >
            <Image
              src={IstexViewIcon}
              alt={t("formatLinks.istexViewAltText")}
            />
          </FileButtonRoot>
        </Box>
      </FileListCategoryRoot>

      {externalPdfUrl != null && (
        <FileListCategoryRoot>
          <FileListCategoryHeader>{t("openAccess")}</FileListCategoryHeader>
          <Box sx={{ display: "flex" }}>
            <FileButtonRoot
              href={externalPdfUrl.href}
              label={t("formatLinks.openAccess")}
            >
              <Image
                src={OpenAccessIcon}
                alt={t("formatLinks.openAccessAltText")}
              />
            </FileButtonRoot>
          </Box>
        </FileListCategoryRoot>
      )}
    </Stack>
  );
}
