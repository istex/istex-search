import { Skeleton } from "@mui/material";
import ResultsGrid from "./components/ResultsGrid";
import { MIN_PER_PAGE } from "@/config";
import ResultsProvider from "@/contexts/ResultsContext";
import type { ServerComponent } from "@/types/next";

const Loading: ServerComponent = () => (
  <ResultsProvider resultsCount={0}>
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
  </ResultsProvider>
);

export default Loading;
