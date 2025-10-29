"use client";

import * as React from "react";
import type { SelectedDocument } from "./DocumentContext";
import { DEFAULT_SORT_BY, NO_FORMAT_SELECTED } from "@/config";
import SearchParams from "@/lib/SearchParams";
import { buildExtractParamsFromFormats } from "@/lib/formats";

export interface HistoryEntry {
  date: number;
  searchParams: SearchParams;
  selectedDocuments?: SelectedDocument[];
  excludedDocuments?: string[];
}

const HISTORY_KEY = "history";
const CURRENT_REQUEST_KEY = "currentRequest";
const HISTORY_LIMIT = 30;

interface HistoryContextValue {
  get: () => HistoryEntry[];
  push: (item: HistoryEntry) => void;
  delete: (index: number) => void;
  clear: () => void;
  getCurrentRequest: () => HistoryEntry;
  populateCurrentRequest: (newCurrentRequest: HistoryEntry) => void;
  isEmpty: () => boolean;
}

const HistoryContext = React.createContext<HistoryContextValue | null>(null);

const initialCurrentRequest: HistoryEntry = {
  date: 0,
  searchParams: new SearchParams({
    q: "",
    extract: buildExtractParamsFromFormats(NO_FORMAT_SELECTED),
    size: (0).toString(),
    sortBy: DEFAULT_SORT_BY,
  }),
};

interface HistoryProviderProps {
  children: React.ReactNode;
}

export function HistoryProvider({ children }: HistoryProviderProps) {
  const [history, setHistory] = React.useState(getHistoryFromLocalStorage());
  const [currentRequest, setCurrentRequest] = React.useState(
    getCurrentRequestFromLocalStorage(),
  );

  const get: HistoryContextValue["get"] = () => {
    return history;
  };

  const push: HistoryContextValue["push"] = (item) => {
    const newHistory = [...history];

    newHistory.unshift(item);

    if (newHistory.length > HISTORY_LIMIT) {
      history.pop();
    }

    setHistory(newHistory);
  };

  const _delete: HistoryContextValue["delete"] = (index) => {
    if (!isIndexValid(index)) {
      return;
    }

    setHistory(history.toSpliced(index, 1));
  };

  const clear: HistoryContextValue["clear"] = () => {
    setHistory([]);
  };

  const getCurrentRequest: HistoryContextValue["getCurrentRequest"] = () => {
    return currentRequest;
  };

  const populateCurrentRequest: HistoryContextValue["populateCurrentRequest"] =
    (newCurrentRequest) => {
      setCurrentRequest(newCurrentRequest);
    };

  const isEmpty: HistoryContextValue["isEmpty"] = () => {
    return history.length === 0;
  };

  const isIndexValid = (index: number) => {
    return index >= 0 || index < history.length;
  };

  React.useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  React.useEffect(() => {
    window.localStorage.setItem(
      CURRENT_REQUEST_KEY,
      JSON.stringify(currentRequest),
    );
  }, [currentRequest]);

  const contextValue: HistoryContextValue = {
    get,
    push,
    delete: _delete,
    clear,
    getCurrentRequest,
    populateCurrentRequest,
    isEmpty,
  };

  return <HistoryContext value={contextValue}>{children}</HistoryContext>;
}

function getHistoryFromLocalStorage() {
  // We can't use local storage while running in a server environment so we just return the
  // default value
  if (typeof window === "undefined") {
    return [];
  }

  const historyFromLocalStorage = window.localStorage.getItem(HISTORY_KEY);
  if (historyFromLocalStorage == null) {
    return [];
  }

  const result: HistoryEntry[] = [];
  const parsed = JSON.parse(historyFromLocalStorage) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Unexpected history structure");
  }

  for (const entry of parsed as unknown[]) {
    if (
      typeof entry !== "object" ||
      entry == null ||
      !("date" in entry) ||
      typeof entry.date !== "number" ||
      !("searchParams" in entry) ||
      typeof entry.searchParams !== "string"
    ) {
      throw new Error("Unexpected history entry structure");
    }

    result.push({
      date: entry.date,
      searchParams: new SearchParams(entry.searchParams),
      selectedDocuments:
        "selectedDocuments" in parsed && Array.isArray(parsed.selectedDocuments)
          ? parsed.selectedDocuments
          : [],
      excludedDocuments:
        "excludedDocuments" in parsed && Array.isArray(parsed.excludedDocuments)
          ? parsed.excludedDocuments
          : [],
    });
  }

  return result;
}

function getCurrentRequestFromLocalStorage() {
  // We can't use local storage while running in a server environment so we just return the
  // default value
  if (typeof window === "undefined") {
    return initialCurrentRequest;
  }

  const currentRequestFromLocalStorage =
    window.localStorage.getItem(CURRENT_REQUEST_KEY);
  if (currentRequestFromLocalStorage == null) {
    return initialCurrentRequest;
  }

  const parsed = JSON.parse(currentRequestFromLocalStorage) as unknown;
  if (
    typeof parsed !== "object" ||
    parsed == null ||
    !("date" in parsed) ||
    typeof parsed.date !== "number" ||
    !("searchParams" in parsed) ||
    typeof parsed.searchParams !== "string"
  ) {
    throw new Error("Unexpected current request structure");
  }

  const result: HistoryEntry = {
    date: parsed.date,
    searchParams: new SearchParams(parsed.searchParams),
    selectedDocuments:
      "selectedDocuments" in parsed && Array.isArray(parsed.selectedDocuments)
        ? parsed.selectedDocuments
        : [],
    excludedDocuments:
      "excludedDocuments" in parsed && Array.isArray(parsed.excludedDocuments)
        ? parsed.excludedDocuments
        : [],
  };

  return result;
}

export function useHistoryContext() {
  const context = React.useContext(HistoryContext);

  if (context == null) {
    throw new Error("useHistoryContext must be within an HistoryProvider");
  }

  return context;
}
