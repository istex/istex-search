import { Container } from "@mui/material";
import SearchSection from "../../components/SearchSection";
import { DocumentProvider } from "../Document/DocumentContext";
import { FacetProvider, type FacetList } from "../facets/FacetContext";
import RawRequest from "./RawRequest";
import { QueryProvider, type QueryContextValue } from "@/contexts/QueryContext";
import type { IstexApiResponse } from "@/lib/istexApi";
import type { ServerComponent } from "@/types/next";

// It would be better to declare this in a layout but we need the query string which is fetched
// in the search params, which are not available in a layout.

const ResultsPageShell: ServerComponent<
  QueryContextValue & { facets?: FacetList; results?: IstexApiResponse },
  true
> = ({ queryString, resultsCount, facets, results, children }) => (
  <QueryProvider queryString={queryString} resultsCount={resultsCount}>
    <DocumentProvider results={results}>
      <FacetProvider facets={facets}>
        <SearchSection />
        <RawRequest />

        <Container component="section" sx={{ pb: 6 }}>
          {children}
        </Container>
      </FacetProvider>
    </DocumentProvider>
  </QueryProvider>
);

export default ResultsPageShell;
