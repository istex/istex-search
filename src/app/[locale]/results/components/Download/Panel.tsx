import { Paper } from "@mui/material";
import type { PaperProps } from "@mui/material/Paper";
import type { ServerComponent } from "@/types/next";

const Panel: ServerComponent<Omit<PaperProps, "elevation">> = (props) => (
  <Paper elevation={0} sx={{ p: 2 }} {...props} />
);

export default Panel;
