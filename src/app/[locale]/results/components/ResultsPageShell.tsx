import { Container } from "@mui/material";
import SearchSection from "../../components/SearchSection";
import { FacetProvider, type FacetList } from "../facets/FacetContext";
import RawRequest from "./RawRequest";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { QueryProvider, type QueryContextProps } from "@/contexts/QueryContext";
import type { IstexApiResponse } from "@/lib/istexApi";
import type { ServerComponent } from "@/types/next";

// It would be better to declare this in a layout but we need the query string which is fetched
// in the search params, which are not available in a layout.

const ResultsPageShell: ServerComponent<
  QueryContextProps & {
    facets?: FacetList;
    results?: IstexApiResponse;
    loading?: boolean;
  },
  true
> = ({ queryString, resultsCount, facets, results, loading, children }) => (
  <DocumentProvider results={results}>
    <QueryProvider
      queryString={queryString}
      resultsCount={resultsCount}
      loading={loading}
    >
      <FacetProvider facets={facets}>
        <SearchSection />
        <RawRequest />

        <Container component="section" sx={{ pb: 6 }}>
          {children}
        </Container>
      </FacetProvider>
    </QueryProvider>
  </DocumentProvider>
);

export default ResultsPageShell;
