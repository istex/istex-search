import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";
import type { ServerComponent } from "@/types/next";

const PanelTitle: ServerComponent<
  Omit<
    TypographyProps & { component?: React.ElementType },
    "variant" | "gutterBottom" | "color" | "fontSize"
  >
> = (props) => (
  <Typography
    component="h2"
    variant="h6"
    gutterBottom
    color="primary"
    fontSize="0.875rem"
    {...props}
  />
);

export default PanelTitle;
