import { Container } from "@mui/material";
import type * as React from "react";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { type QueryContextProps, QueryProvider } from "@/contexts/QueryContext";
import SearchSection from "../../components/SearchSection";
import CompleteQuery from "./CompleteQuery";

// It would be better to declare this in a layout but we need the query string which is fetched
// in the search params, which are not available in a layout.

type ResultsPageShellProps = Omit<QueryContextProps, "children"> & {
  loading?: boolean;
  children?: React.ReactNode;
};

export default function ResultsPageShell({
  queryString,
  results,
  randomSeed,
  loading,
  errorInfo,
  children,
}: ResultsPageShellProps) {
  // It would be simpler to pass the entire error but passing not plain
  // object from server components (the ResultsPageShell here) to client components
  // (the QueryProvider here) is not allowed
  return (
    <QueryProvider
      queryString={queryString}
      results={results}
      randomSeed={randomSeed}
      loading={loading}
      errorInfo={errorInfo}
    >
      <DocumentProvider>
        <SearchSection />
        {errorInfo == null ? <CompleteQuery /> : null}

        <Container component="section" sx={{ pb: 6 }}>
          {children}
        </Container>
      </DocumentProvider>
    </QueryProvider>
  );
}
