"use client";

import * as React from "react";
import { DEFAULT_SORT_BY, NO_FORMAT_SELECTED } from "@/config";
import { buildExtractParamsFromFormats } from "@/lib/formats";
import { SearchParams } from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

export interface HistoryEntry {
  date: number;
  searchParams: SearchParams;
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

export const HistoryProvider: ClientComponent<{}, true> = ({ children }) => {
  // The context is first rendered on the server before client hydration and local storage isn't
  // available on the server, so we skip the initialization in that case
  let historyFromLocalStorage;
  let currentRequestFromLocalStorage;
  let historyInitialized = false;
  let currentRequestInitialized = false;
  if (typeof window !== "undefined") {
    historyFromLocalStorage = window.localStorage.getItem(HISTORY_KEY);
    currentRequestFromLocalStorage =
      window.localStorage.getItem(CURRENT_REQUEST_KEY);
    historyInitialized = historyFromLocalStorage != null;
    currentRequestInitialized = currentRequestFromLocalStorage != null;
  }

  const [history, setHistory] = React.useState<HistoryEntry[]>(
    historyInitialized && historyFromLocalStorage != null
      ? parseHistory(historyFromLocalStorage)
      : [],
  );
  const [currentRequest, setCurrentRequest] = React.useState<HistoryEntry>(
    currentRequestInitialized && currentRequestFromLocalStorage != null
      ? parseCurrentRequest(currentRequestFromLocalStorage)
      : initialCurrentRequest,
  );

  const get: HistoryContextValue["get"] = () => {
    return history;
  };

  const push: HistoryContextValue["push"] = (item) => {
    history.unshift(item);

    if (history.length > HISTORY_LIMIT) {
      history.pop();
    }

    update();
  };

  const _delete: HistoryContextValue["delete"] = (index) => {
    if (!isIndexValid(index)) {
      return;
    }

    history.splice(index, 1);
    update();
  };

  const clear: HistoryContextValue["clear"] = () => {
    history.splice(0, history.length);
    update();
  };

  const getCurrentRequest: HistoryContextValue["getCurrentRequest"] = () => {
    return currentRequest;
  };

  const populateCurrentRequest: HistoryContextValue["populateCurrentRequest"] =
    (newCurrentRequest) => {
      Object.assign(currentRequest, newCurrentRequest);

      update();
    };

  const isEmpty: HistoryContextValue["isEmpty"] = () => {
    return history.length === 0;
  };

  const update = () => {
    setHistory([...history]);
    setCurrentRequest({ ...currentRequest });
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    window.localStorage.setItem(
      CURRENT_REQUEST_KEY,
      JSON.stringify(currentRequest),
    );
  };

  const isIndexValid = (index: number) => {
    return index >= 0 || index < history.length;
  };

  if (
    typeof window !== "undefined" &&
    (!historyInitialized || !currentRequestInitialized)
  ) {
    update();
  }

  const contextValue: HistoryContextValue = {
    get,
    push,
    delete: _delete,
    clear,
    getCurrentRequest,
    populateCurrentRequest,
    isEmpty,
  };

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
};

function parseHistory(historyFromLocalStorage: string) {
  const result: HistoryEntry[] = [];
  const parsed = JSON.parse(historyFromLocalStorage);
  if (!Array.isArray(parsed)) {
    throw new Error("Unexpected history structure");
  }

  for (const entry of parsed) {
    if (
      typeof entry.date !== "number" &&
      typeof entry.searchParams !== "string"
    ) {
      throw new Error("Unexpected history entry structure");
    }

    result.push({
      date: entry.date,
      searchParams: new SearchParams(entry.searchParams as string),
    });
  }

  return result;
}

function parseCurrentRequest(currentRequestFromLocalStorage: string) {
  const parsed = JSON.parse(currentRequestFromLocalStorage);
  if (
    typeof parsed.date !== "number" &&
    typeof parsed.searchParams !== "string"
  ) {
    throw new Error("Unexpected current request structure");
  }

  const result: HistoryEntry = {
    date: parsed.date,
    searchParams: new SearchParams(parsed.searchParams as string),
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
