"use client";

import { createContext, useContext } from "react";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useRouter } from "@/i18n/navigation";
import type { CustomErrorInfo } from "@/lib/CustomError";
import useSearchParams, { type SearchParams } from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

interface QueryContextValue {
  queryString: string;
  resultsCount: number;
  goToResultsPage: (
    queryString: string,
    searchParams?: SearchParams,
  ) => Promise<void>;
  randomSeed?: string;
  loading?: boolean;
  errorInfo?: CustomErrorInfo;
}

export type QueryContextProps = Omit<QueryContextValue, "goToResultsPage">;

const QueryContext = createContext<QueryContextValue | null>(null);

export const QueryProvider: ClientComponent<QueryContextProps, true> = (
  props,
) => {
  const router = useRouter();
  const defaultSearchParams = useSearchParams();
  const { resetSelectedExcludedDocuments } = useDocumentContext();

  const goToResultsPage = async (
    newQueryString: string,
    searchParams?: SearchParams,
  ) => {
    localStorage.setItem("lastQueryString", newQueryString);

    // The context consumer can provide their own SearchParams instead
    // if they need to specify other search params. If they don't, the
    // search params used for the previous render are used.
    const searchParamsToUse = searchParams ?? defaultSearchParams;
    searchParamsToUse.clear();
    await searchParamsToUse.setQueryString(newQueryString);

    resetSelectedExcludedDocuments();
    router.push(`/results?${searchParamsToUse.toString()}`);
  };

  return (
    <QueryContext.Provider value={{ goToResultsPage, ...props }}>
      {props.children}
    </QueryContext.Provider>
  );
};

export function useQueryContext() {
  const context = useContext(QueryContext);

  if (context == null) {
    throw new Error("useQueryContext must be within a ResultsProvider");
  }

  return context;
}
