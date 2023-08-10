import { Box } from "@mui/material";
import type { ServerComponent } from "@/types/next";

interface ResultsGridProps {
  size: number;
  columns: number;
}

const ResultsGrid: ServerComponent<ResultsGridProps, true> = ({
  size,
  columns,
  children,
}) => (
  <Box
    id="results-grid"
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: `repeat(${columns}, 1fr)` },
      gridTemplateRows: {
        xs: `repeat(${size}, 1fr)`,
        sm: `repeat(${Math.ceil(size / columns)}, 1fr)`,
      },
      gap: 2,
    }}
  >
    {children}
  </Box>
);

export default ResultsGrid;
