import { Box, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type * as React from "react";
import type { FileInfo } from "@/lib/istexApi";
import FileButton from "./FileButton";

export interface FileListCategoryProps {
  category: string;
  files: (FileInfo & { labelOverride?: string })[];
}

export default function FileListCategory({
  category,
  files,
}: FileListCategoryProps) {
  const t = useTranslations("results.Document");

  return (
    <FileListCategoryRoot>
      <FileListCategoryHeader>{t(category)}</FileListCategoryHeader>

      <Stack
        direction="row"
        sx={{
          flexWrap: "wrap",
          gap: 0.5,
        }}
      >
        {files.map(({ labelOverride, extension, uri }) => {
          const fullUri = new URL(uri);
          fullUri.searchParams.set("sid", "istex-search");

          return (
            <FileButton
              key={labelOverride ?? extension}
              category={category}
              labelOverride={labelOverride}
              extension={extension}
              uri={fullUri}
            />
          );
        })}
      </Stack>
    </FileListCategoryRoot>
  );
}

export function FileListCategoryRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box sx={{ fontSize: "0.8rem" }}>{children}</Box>;
}

export function FileListCategoryHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Typography
      component="h4"
      variant="subtitle2"
      sx={{
        fontSize: "inherit",
      }}
    >
      {children}
    </Typography>
  );
}
