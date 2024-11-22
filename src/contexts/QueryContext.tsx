"use client";

import * as React from "react";
import { useHistoryContext } from "./HistoryContext";
import { resetSelectedExcludedDocuments } from "@/contexts/DocumentContext";
import { useRouter } from "@/i18n/routing";
import type { CustomErrorInfo } from "@/lib/CustomError";
import type SearchParams from "@/lib/SearchParams";
import { useSearchParams } from "@/lib/hooks";
import type { IstexApiResponse } from "@/lib/istexApi";

interface QueryContextValue {
  queryString: string;
  results: IstexApiResponse;
  goToResultsPage: (
    queryString: string,
    searchParams?: SearchParams,
  ) => Promise<void>;
  randomSeed?: string;
  loading?: boolean;
  errorInfo?: CustomErrorInfo;
}

export interface QueryContextProps
  extends Omit<QueryContextValue, "goToResultsPage"> {
  children: React.ReactNode;
}

const QueryContext = React.createContext<QueryContextValue | null>(null);

export function QueryProvider(props: QueryContextProps) {
  const router = useRouter();
  const defaultSearchParams = useSearchParams();
  const history = useHistoryContext();

  const goToResultsPage: QueryContextValue["goToResultsPage"] = async (
    newQueryString,
    searchParams,
  ) => {
    localStorage.setItem("lastQueryString", newQueryString);

    // The context consumer can provide their own SearchParams instead
    // if they need to specify other search params. If they don't, the
    // search params used for the previous render are used.
    const searchParamsToUse = searchParams ?? defaultSearchParams;
    searchParamsToUse.deleteSize();
    searchParamsToUse.deletePage();
    searchParamsToUse.deleteFilters();
    searchParamsToUse.deleteRandomSeed();
    await searchParamsToUse.setQueryString(newQueryString);

    history.populateCurrentRequest({
      date: Date.now(),
      searchParams: searchParamsToUse,
    });

    resetSelectedExcludedDocuments();
    router.push(`/results?${searchParamsToUse.toString()}`);
  };

  return (
    <QueryContext.Provider value={{ goToResultsPage, ...props }}>
      {props.children}
    </QueryContext.Provider>
  );
}

export function useQueryContext() {
  const context = React.useContext(QueryContext);

  if (context == null) {
    throw new Error("useQueryContext must be within a QueryProvider");
  }

  return context;
}
