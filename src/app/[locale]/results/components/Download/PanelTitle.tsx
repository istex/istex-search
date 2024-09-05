import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";

export default function PanelTitle(
  props: TypographyProps & { component?: React.ElementType },
) {
  return (
    <Typography
      component="h2"
      variant="h6"
      gutterBottom
      {...props}
      sx={{
        color: "primary.main",
        fontSize: "0.875rem",
        ...props.sx,
      }}
    />
  );
}
