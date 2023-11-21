import { Container } from "@mui/material";
import SearchSection from "../../components/SearchSection";
import RawRequest from "./RawRequest";
import { QueryProvider, type QueryContextValue } from "@/contexts/QueryContext";
import type { ServerComponent } from "@/types/next";

// It would be better to declare this in a layout but we need the query string which is fetched
// in the search params, which are not available in a layout.

const ResultsPageShell: ServerComponent<QueryContextValue, true> = ({
  queryString,
  resultsCount,
  children,
}) => (
  <QueryProvider queryString={queryString} resultsCount={resultsCount}>
    <SearchSection />
    <RawRequest />

    <Container component="section" sx={{ pb: 6 }}>
      {children}
    </Container>
  </QueryProvider>
);

export default ResultsPageShell;
