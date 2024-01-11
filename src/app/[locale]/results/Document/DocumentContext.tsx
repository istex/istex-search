"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { IstexApiResponse, Result } from "@/lib/istexApi";
import type { ClientComponent } from "@/types/next";

export interface DocumentContextValue {
  displayedDocument?: Result;
  displayDocument: (documentId: string) => void;
  closeDocument: () => void;
  selectedDocuments: string[];
  excludedDocuments: string[];
  toggleSelectedDocument: (documentId: string) => void;
  toggleExcludedDocument: (documentId: string) => void;
  resetSelectedExcludedDocuments: () => void;
}

const DocumentContext = createContext<DocumentContextValue | null>(null);

export const DocumentProvider: ClientComponent<
  { results?: IstexApiResponse },
  true
> = ({ children, results }) => {
  const [displayedDocument, setDisplayedDocument] = useState<
    Result | undefined
  >(undefined);

  const initialSelectedDocuments = localStorage.getItem("selectedDocuments");
  const initialExcludedDocuments = localStorage.getItem("excludedDocuments");

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(
    initialSelectedDocuments != null
      ? JSON.parse(initialSelectedDocuments)
      : [],
  );
  const [excludedDocuments, setExcludedDocuments] = useState<string[]>(
    initialExcludedDocuments != null
      ? JSON.parse(initialExcludedDocuments)
      : [],
  );

  useEffect(() => {
    localStorage.setItem(
      "selectedDocuments",
      JSON.stringify(selectedDocuments),
    );
  }, [selectedDocuments]);

  useEffect(() => {
    localStorage.setItem(
      "excludedDocuments",
      JSON.stringify(excludedDocuments),
    );
  }, [excludedDocuments]);

  const displayDocument = async (documentId: string) => {
    const newDocument = results?.hits.find(
      (result) => result.id === documentId,
    );
    setDisplayedDocument(newDocument);
  };

  const closeDocument = () => {
    setDisplayedDocument(undefined);
  };

  const toggleSelectedDocument = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  const toggleExcludedDocument = (documentId: string) => {
    if (excludedDocuments.includes(documentId)) {
      setExcludedDocuments(excludedDocuments.filter((id) => id !== documentId));
    } else {
      setExcludedDocuments([...excludedDocuments, documentId]);
    }
  };

  const resetSelectedExcludedDocuments = () => {
    localStorage.removeItem("selectedDocuments");
    localStorage.removeItem("excludedDocuments");
  };

  const context = {
    displayedDocument,
    displayDocument,
    closeDocument,
    selectedDocuments,
    excludedDocuments,
    toggleSelectedDocument,
    toggleExcludedDocument,
    resetSelectedExcludedDocuments,
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
