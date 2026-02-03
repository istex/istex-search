import { Box, Stack, type StackProps, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { getExternalPdfUrl, type Result } from "@/lib/istexApi";
import FileButton from "./FileButton";

interface FileListProps {
  document: Result;
  direction?: StackProps["direction"];
  gap?: StackProps["gap"];
}

export default function FileList({ document, direction, gap }: FileListProps) {
  const t = useTranslations("results.Document");
  const externalPdfUrl = getExternalPdfUrl(document);

  const data = {
    fulltext: document.fulltext?.map((file) => ({
      ...file,
      enrichmentName: null,
    })),
    metadata: document.metadata?.map((file) => ({
      ...file,
      enrichmentName: null,
    })),
    annexes: document.annexes?.map((file) => ({
      ...file,
      enrichmentName: null,
    })),
    enrichments:
      document.enrichments != null
        ? Object.entries(document.enrichments).map((enrichment) => ({
            enrichmentName: enrichment[0],
            extension: enrichment[1][0].extension,
            uri: enrichment[1][0].uri,
          }))
        : undefined,
    openAccess:
      externalPdfUrl != null
        ? [
            {
              extension: "openAccess",
              uri: externalPdfUrl.href,
              enrichmentName: null,
            },
          ]
        : undefined,
  };

  return (
    <Stack
      direction={direction}
      sx={{
        gap,
      }}
    >
      {Object.entries(data).map(([category, files]) => {
        if (files == null) {
          return null;
        }

        return (
          <Box key={category} sx={{ fontSize: "0.8rem" }}>
            <Typography
              component="h4"
              variant="subtitle2"
              sx={{
                fontSize: "inherit",
              }}
            >
              {t(category)}
            </Typography>
            <Stack
              direction="row"
              sx={{
                flexWrap: "wrap",
                gap: 0.5,
              }}
            >
              {files.map(({ enrichmentName, extension, uri }) => {
                const fullUri = new URL(uri);
                fullUri.searchParams.set("sid", "istex-search");

                return (
                  <FileButton
                    key={enrichmentName ?? extension}
                    category={category}
                    enrichmentName={enrichmentName}
                    extension={extension}
                    uri={fullUri}
                  />
                );
              })}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
