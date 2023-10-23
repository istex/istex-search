import { Skeleton } from "@mui/material";
import ResultsGrid from "./components/ResultsGrid";
import { MIN_PER_PAGE } from "@/config";
import type { ServerComponent } from "@/types/next";

const Loading: ServerComponent = () => (
  <ResultsGrid>
    {Array(MIN_PER_PAGE)
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
