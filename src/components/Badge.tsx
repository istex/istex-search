"use client";

import { type AlertProps, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface BadgeProps {
  label: string;
  severity: NonNullable<AlertProps["severity"]>;
}

export default function Badge({ label, severity }: BadgeProps) {
  return (
    <Chip
      label={label}
      sx={(theme) => ({
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
      })}
    />
  );
}
