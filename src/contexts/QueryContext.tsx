"use client";

import * as React from "react";
import type { CustomErrorInfo } from "@/lib/CustomError";
import type { IstexApiResponse } from "@/lib/istexApi";

interface QueryContextValue {
  queryString: string;
  results: IstexApiResponse;
  randomSeed?: string;
  loading?: boolean;
  errorInfo?: CustomErrorInfo;
}

export interface QueryContextProps extends QueryContextValue {
  children: React.ReactNode;
}

const QueryContext = React.createContext<QueryContextValue | null>(null);

export function QueryProvider(props: QueryContextProps) {
  return <QueryContext value={props}>{props.children}</QueryContext>;
}

export function useQueryContext() {
  const context = React.useContext(QueryContext);

  if (context == null) {
    throw new Error("useQueryContext must be within a QueryProvider");
  }

  return context;
}
