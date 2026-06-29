"use client";

import { type AlertProps, Chip } from "@mui/material";
import { alpha, type SxProps, useTheme } from "@mui/material/styles";

interface BadgeProps {
  label: string;
  severity: NonNullable<AlertProps["severity"]>;
  sx?: SxProps;
}

export default function Badge({ label, severity, sx }: BadgeProps) {
  const theme = useTheme();

  return (
    <Chip
      label={label}
      sx={{
        fontSize: "0.6rem",
        fontWeight: "bold",
        width: "fit-content",
        height: "18px",
        border: 1,
        borderColor: theme.vars.palette[severity].dark,
        bgcolor: alpha(theme.palette[severity].main, 0.5),
        color: theme.vars.palette[severity].dark,
        "& .MuiChip-label": {
          px: "4px",
        },
        ...sx,
      }}
    />
  );
}
