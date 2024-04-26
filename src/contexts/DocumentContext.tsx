"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { IstexApiResponse, Result } from "@/lib/istexApi";
import type { ClientComponent } from "@/types/next";

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
      setSelectedDocuments(
        JSON.parse(selectedDocumentsString) as SelectedDocument[],
      );
    }
    const excludedDocumentsString = localStorage.getItem("excludedDocuments");
    if (excludedDocumentsString !== null) {
      setExcludedDocuments(JSON.parse(excludedDocumentsString) as string[]);
    }
  }, []);

  const [selectedDocuments, setSelectedDocuments] = useState<
    SelectedDocument[]
  >([]);
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

  const toggleSelectedDocument = (documentArkIstex: string) => {
    let newSelectedDocuments: SelectedDocument[];
    if (selectedDocuments.some((doc) => doc.arkIstex === documentArkIstex)) {
      newSelectedDocuments = selectedDocuments.filter(
        (doc) => doc.arkIstex !== documentArkIstex,
      );
    } else {
      const selectedDocument = results?.hits.find(
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
    throw new Error("useDocumentContext must be within a DocumentProvider");
  }

  return context;
}
