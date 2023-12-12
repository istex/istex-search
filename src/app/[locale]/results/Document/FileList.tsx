"use client";

import FileIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { IconButton, Stack, Typography } from "@mui/material";
import type { ClientComponent } from "@/types/next";

const FileList: ClientComponent<{
  files: Array<{ extension: string; uri: string }>;
}> = ({ files }) => {
  return (
    <Stack direction="row" flexWrap="wrap">
      {files.map(({ extension, uri }, index) => (
        <IconButton
          href={uri}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={extension}
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FileIcon fontSize="large" />
          <Typography variant="caption">{extension}</Typography>
        </IconButton>
      ))}
    </Stack>
  );
};

export default FileList;
