import * as React from "react";
import { useTranslations } from "next-intl";
import { Box, Stack, Typography, type StackProps } from "@mui/material";
import FileButton from "./FileButton";
import type { Result } from "@/lib/istexApi";

interface FileListProps {
  document: Result;
  direction?: StackProps["direction"];
  gap?: StackProps["gap"];
}

export default function FileList({ document, direction, gap }: FileListProps) {
  const t = useTranslations("results.Document");

  const data = React.useMemo(
    () => ({
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
    }),
    [document],
  );

  return (
    <Stack direction={direction} gap={gap}>
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
            <Stack direction="row" flexWrap="wrap" gap={0.5}>
              {files.map(({ enrichmentName, extension, uri }) => {
                const fullUri = new URL(uri);
                fullUri.searchParams.set("sid", "istex-search");

                return (
                  <FileButton
                    key={enrichmentName ?? extension}
                    document={document}
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
