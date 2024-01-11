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

  useEffect(() => {
    const selectedDocumentsString = localStorage.getItem("selectedDocuments");
    if (selectedDocumentsString !== null) {
      setSelectedDocuments(JSON.parse(selectedDocumentsString));
    }
    const excludedDocumentsString = localStorage.getItem("excludedDocuments");
    if (excludedDocumentsString !== null) {
      setExcludedDocuments(JSON.parse(excludedDocumentsString));
    }
  }, []);

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [excludedDocuments, setExcludedDocuments] = useState<string[]>([]);

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
    let newSelectedDocuments: string[];
    if (selectedDocuments.includes(documentId)) {
      newSelectedDocuments = selectedDocuments.filter(
        (id) => id !== documentId,
      );
    } else {
      newSelectedDocuments = [...selectedDocuments, documentId];
    }
    setSelectedDocuments(newSelectedDocuments);
    localStorage.setItem(
      "selectedDocuments",
      JSON.stringify(newSelectedDocuments),
    );
  };

  const toggleExcludedDocument = (documentId: string) => {
    let newExcludedDocuments: string[];
    if (excludedDocuments.includes(documentId)) {
      newExcludedDocuments = excludedDocuments.filter(
        (id) => id !== documentId,
      );
    } else {
      newExcludedDocuments = [...excludedDocuments, documentId];
    }
    setExcludedDocuments(newExcludedDocuments);
    localStorage.setItem(
      "excludedDocuments",
      JSON.stringify(newExcludedDocuments),
    );
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
