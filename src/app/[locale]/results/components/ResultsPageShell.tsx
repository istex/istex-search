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
> = ({
  queryString,
  resultsCount,
  facets,
  results,
  loading,
  errorInfo,
  children,
}) => (
  <DocumentProvider results={results}>
    {/* It would be simpler to pass the entire error but passing not plain */}
    {/* object from server components (the ResultsPageShell here) to client components */}
    {/* (the QueryProvider here) is not allowed */}
    <QueryProvider
      queryString={queryString}
      resultsCount={resultsCount}
      loading={loading}
      errorInfo={errorInfo}
    >
      <FacetProvider facets={facets}>
        <SearchSection />
        {errorInfo == null ? <RawRequest /> : null}

        <Container component="section" sx={{ pb: 6 }}>
          {children}
        </Container>
      </FacetProvider>
    </QueryProvider>
  </DocumentProvider>
);

export default ResultsPageShell;
