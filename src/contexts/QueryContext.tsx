"use client";

import { createContext, useContext } from "react";
import { type ClientComponent } from "@/types/next";

export interface QueryContextValue {
  queryString: string;
  resultsCount: number;
  loading?: boolean;
}

const QueryContext = createContext<QueryContextValue | null>(null);

export const QueryProvider: ClientComponent<QueryContextValue, true> = ({
  queryString,
  resultsCount,
  loading,
  children,
}) => (
  <QueryContext.Provider
    value={{
      queryString,
      resultsCount,
      loading,
    }}
  >
    {children}
  </QueryContext.Provider>
);

export function useQueryContext() {
  const context = useContext(QueryContext);

  if (context == null) {
    throw new Error("useQueryContext must be within a ResultsProvider");
  }

  return context;
}
