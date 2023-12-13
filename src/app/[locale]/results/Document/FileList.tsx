"use client";

import { useTranslations } from "next-intl";
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { IconButton, Stack, Typography } from "@mui/material";
import type { ClientComponent } from "@/types/next";

const FileList: ClientComponent<{
  files: Array<{ key?: string; extension: string; uri: string }>;
  titleKey: string;
}> = ({ files, titleKey }) => {
  const t = useTranslations("results.Document.formatsLinks");
  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {files.map(({ key, extension, uri }, index) => (
        <IconButton
          href={uri}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={key ?? extension}
          key={index}
          disableRipple
          title={t(titleKey, { key, extension })}
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            borderRadius: 0,
            p: 0.5,
            "&:hover": {
              color: "colors.blue",
            },
          }}
        >
          <FileIcon fontSize="large" />
          <Typography variant="caption">{key ?? extension}</Typography>
        </IconButton>
      ))}
    </Stack>
  );
};

export default FileList;
