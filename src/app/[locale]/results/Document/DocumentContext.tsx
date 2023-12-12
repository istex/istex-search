"use client";

import { createContext, useContext, useState } from "react";
import type { IstexApiResponse, Result } from "@/lib/istexApi";
import type { ClientComponent } from "@/types/next";

export interface DocumentContextValue {
  displayedDocument?: Result;
  displayDocument: (documentId: string) => void;
  closeDocument: () => void;
}

const DocumentContext = createContext<DocumentContextValue | null>(null);

export const DocumentProvider: ClientComponent<
  { results?: IstexApiResponse },
  true
> = ({ children, results }) => {
  const [displayedDocument, setDisplayedDocument] = useState<
    Result | undefined
  >(undefined);

  const displayDocument = async (documentId: string) => {
    const newDocument = results?.hits.find(
      (result) => result.id === documentId,
    );
    setDisplayedDocument(newDocument);
  };

  const closeDocument = () => {
    setDisplayedDocument(undefined);
  };

  const context = {
    displayedDocument,
    displayDocument,
    closeDocument,
  };
  return (
    <DocumentContext.Provider value={context}>
      {children}
    </DocumentContext.Provider>
  );
};

export function useDocumentContext() {
  const context = useContext(DocumentContext);

  if (context == null) {
    throw new Error(
      "useDocumentContext must be within a DocumentContextProvider",
    );
  }

  return context;
}
