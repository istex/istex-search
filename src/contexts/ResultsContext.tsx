"use client";

import { createContext, useContext } from "react";
import { type ClientComponent } from "@/types/next";

interface ResultsContextValue {
  resultsCount: number;
}

const ResultsContext = createContext<ResultsContextValue | null>(null);

const ResultsProvider: ClientComponent<ResultsContextValue, true> = ({
  resultsCount,
  children,
}) => (
  <ResultsContext.Provider
    value={{
      resultsCount,
    }}
  >
    {children}
  </ResultsContext.Provider>
);

export function useResultsContext() {
  const context = useContext(ResultsContext);

  if (context == null) {
    throw new Error("useResultsContext must be within a ResultsProvider");
  }

  return context;
}

export default ResultsProvider;
