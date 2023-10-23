import { Box } from "@mui/material";
import type { ServerComponent } from "@/types/next";

const ResultsGrid: ServerComponent<{}, true> = ({ children }) => (
  <Box
    id="results-grid"
    sx={{
      my: 2,
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
      gap: 2,
    }}
  >
    {children}
  </Box>
);

export default ResultsGrid;
