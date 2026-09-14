"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import type * as React from "react";
import { setCurrentRequestInLocalStorage } from "./HistoryContext";

// NOTE:
// If we remove the current request feature one day, we can remove this wrapper
// entirely and directly use the NuqsAdapter in the root layout.

interface CustomNuqsAdapterProps {
  children: React.ReactNode;
}

export default function CustomNuqsAdapter({
  children,
}: CustomNuqsAdapterProps) {
  return (
    <NuqsAdapter
      processUrlSearchParams={
        updateCurrentRequestInLocalStorageWhenUpdatingSearchParams
      }
    >
      {children}
    </NuqsAdapter>
  );
}

function updateCurrentRequestInLocalStorageWhenUpdatingSearchParams(
  searchParams: URLSearchParams,
) {
  setCurrentRequestInLocalStorage({
    date: Date.now(),
    searchParams: searchParams.toString(),
  });

  return searchParams;
}
