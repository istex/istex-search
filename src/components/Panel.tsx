import * as React from "react";
import {
  Paper,
  Typography,
  type PaperProps,
  type TypographyProps,
} from "@mui/material";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface PanelProps extends PaperProps {
  heading?: React.ReactNode;
  headingLevel?: HeadingLevel;
}

export default function Panel(props: PanelProps) {
  const { children, heading, headingLevel, sx, ...rest } = props;

  return (
    <Paper
      elevation={0}
      sx={{
        "&&": {
          bgcolor: "white",
        },
        p: 2,
        ...sx,
      }}
      {...rest}
    >
      {heading != null && (
        <PanelTitle headingLevel={headingLevel}>{heading}</PanelTitle>
      )}

      {children}
    </Paper>
  );
}

interface PanelTitleProps extends TypographyProps {
  headingLevel?: HeadingLevel;
}

export function PanelTitle(props: PanelTitleProps) {
  const { headingLevel = 2, sx, ...rest } = props;

  return (
    <Typography
      component={`h${headingLevel}`}
      variant="h6"
      gutterBottom
      sx={{
        color: "primary.main",
        fontSize: "0.875rem",
        ...sx,
      }}
      {...rest}
    />
  );
}
