import { Skeleton } from "@/mui/material";
import ResultsGrid from "./components/ResultsGrid";
import type { ServerComponent } from "@/types/next";

const SIZE = 10;

const Loading: ServerComponent = () => (
  <ResultsGrid size={SIZE} columns={2}>
    {Array(SIZE)
      .fill(0)
      .map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width="100%"
          height="18rem"
          sx={{ borderRadius: "4px" }}
        />
      ))}
  </ResultsGrid>
);

export default Loading;
