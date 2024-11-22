"use client";

import * as React from "react";
import { useQueryContext } from "./QueryContext";
import type { Result } from "@/lib/istexApi";

export interface SelectedDocument {
  arkIstex: string;
  title: string | undefined;
}

export interface DocumentContextValue {
  displayedDocument?: Result;
  displayDocument: (documentId: string) => void;
  closeDocument: () => void;
  selectedDocuments: SelectedDocument[];
  excludedDocuments: string[];
  toggleSelectedDocument: (documentArkIstex: string) => void;
  toggleExcludedDocument: (documentArkIstex: string) => void;
}

const DocumentContext = React.createContext<DocumentContextValue | null>(null);

interface DocumentProviderProps {
  children: React.ReactNode;
}

export function DocumentProvider({ children }: DocumentProviderProps) {
  const [displayedDocument, setDisplayedDocument] = React.useState<
    Result | undefined
  >(undefined);
  const [selectedDocuments, setSelectedDocuments] = React.useState<
    SelectedDocument[]
  >([]);
  const [excludedDocuments, setExcludedDocuments] = React.useState<string[]>(
    [],
  );
  const { results } = useQueryContext();

  React.useEffect(() => {
    const selectedDocumentsString = localStorage.getItem("selectedDocuments");
    if (selectedDocumentsString !== null) {
      setSelectedDocuments(
        JSON.parse(selectedDocumentsString) as SelectedDocument[],
      );
    }
    const excludedDocumentsString = localStorage.getItem("excludedDocuments");
    if (excludedDocumentsString !== null) {
      setExcludedDocuments(JSON.parse(excludedDocumentsString) as string[]);
    }
  }, []);

  const displayDocument = (documentId: string) => {
    const newDocument = results.hits.find((result) => result.id === documentId);
    setDisplayedDocument(newDocument);
  };

  const closeDocument = () => {
    setDisplayedDocument(undefined);
  };

  const toggleSelectedDocument = (documentArkIstex: string) => {
    let newSelectedDocuments: SelectedDocument[];
    if (selectedDocuments.some((doc) => doc.arkIstex === documentArkIstex)) {
      newSelectedDocuments = selectedDocuments.filter(
        (doc) => doc.arkIstex !== documentArkIstex,
      );
    } else {
      const selectedDocument = results.hits.find(
        (result) => result.arkIstex === documentArkIstex,
      );
      newSelectedDocuments = [
        ...selectedDocuments,
        {
          arkIstex: documentArkIstex,
          title: selectedDocument?.title,
        },
      ];
    }
    setSelectedDocuments(newSelectedDocuments);
    localStorage.setItem(
      "selectedDocuments",
      JSON.stringify(newSelectedDocuments),
    );
  };

  const toggleExcludedDocument = (documentArkIstex: string) => {
    let newExcludedDocuments: string[];
    if (excludedDocuments.includes(documentArkIstex)) {
      newExcludedDocuments = excludedDocuments.filter(
        (id) => id !== documentArkIstex,
      );
    } else {
      newExcludedDocuments = [...excludedDocuments, documentArkIstex];
    }
    setExcludedDocuments(newExcludedDocuments);
    localStorage.setItem(
      "excludedDocuments",
      JSON.stringify(newExcludedDocuments),
    );
  };

  const context = {
    displayedDocument,
    displayDocument,
    closeDocument,
    selectedDocuments,
    excludedDocuments,
    toggleSelectedDocument,
    toggleExcludedDocument,
  };

  return (
    <DocumentContext.Provider value={context}>
      {children}
    </DocumentContext.Provider>
  );
}

export function resetSelectedExcludedDocuments() {
  localStorage.removeItem("selectedDocuments");
  localStorage.removeItem("excludedDocuments");
}

export function useDocumentContext() {
  const context = React.useContext(DocumentContext);

  if (context == null) {
    throw new Error("useDocumentContext must be within a DocumentProvider");
  }

  return context;
}
