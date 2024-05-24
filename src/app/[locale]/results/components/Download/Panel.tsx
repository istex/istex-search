import { Paper } from "@mui/material";
import type { PaperProps } from "@mui/material/Paper";

export default function Panel(props: PaperProps) {
  return <Paper elevation={0} sx={{ p: 2 }} {...props} />;
}
