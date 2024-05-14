"use client";

import * as React from "react";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "@/lib/hooks";
import { type ClientComponent } from "@/types/next";

export interface FacetItem {
  key: string | number;
  keyAsString?: string;
  docCount: number;
  selected: boolean;
  excluded: boolean;
  fromAsString?: string;
  from?: string;
  toAsString?: string;
  to?: string;
  isoCode?: string;
}

export type FacetList = Record<string, FacetItem[] | undefined>;

export interface FacetContextValue {
  facetsList?: FacetList;
  clearOneFacet: (facetTitle: string) => void;
  clearAllFacets: () => void;
  applyOneFacet: (facetTitle: string) => void;
  toggleFacet: (facetTitle: string, facetItemValue?: string) => void;
  setRangeFacet: (facetTitle: string, facetRangeValue: string) => void;
  facetsWaitingForApply: string[];
}

const FacetContext = React.createContext<FacetContextValue | null>(null);

export const FacetProvider: ClientComponent<{ facets?: FacetList }, true> = ({
  facets,
  children,
}) => {
  const [facetsWaitingForApply, setFacetsWaitingForApply] = React.useState<
    string[]
  >([]);
  const [facetsList, setFacetsList] = React.useState<FacetList | undefined>(
    facets,
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const history = useHistoryContext();
  const { resetSelectedExcludedDocuments } = useDocumentContext();

  const clearOneFacet = (facetTitle: string) => {
    const newFacetsList = { ...facetsList };
    newFacetsList[facetTitle]?.forEach((facetItem) => {
      facetItem.selected = false;
      facetItem.excluded = false;
    });
    const filters = searchParams.getFilters();
    const { [facetTitle]: _, ...updatedFilters } = filters;
    searchParams.setFilters(updatedFilters);
    searchParams.setPage(1);
    searchParams.deleteLastAppliedFacet();

    history.populateCurrentRequest({
      date: Date.now(),
      searchParams,
    });

    resetSelectedExcludedDocuments();
    router.push(`/results?${searchParams.toString()}`);
  };

  const clearAllFacets = () => {
    searchParams.deleteFilters();
    searchParams.setPage(1);
    searchParams.deleteLastAppliedFacet();

    history.populateCurrentRequest({
      date: Date.now(),
      searchParams,
    });

    resetSelectedExcludedDocuments();
    router.push(`/results?${searchParams.toString()}`);
  };

  const applyOneFacet = (facetTitle: string) => {
    let filters = searchParams.getFilters();
    filters[facetTitle] = [];
    facetsList?.[facetTitle]?.forEach((facetItem) => {
      if (facetItem.selected) {
        if (facetTitle === "language" && facetItem.isoCode !== undefined) {
          filters[facetTitle].push(facetItem.isoCode);
        } else {
          filters[facetTitle].push(
            facetItem.keyAsString ?? facetItem.key.toString(),
          );
        }
      }
      if (facetItem.excluded) {
        if (facetTitle === "language" && facetItem.isoCode !== undefined) {
          filters[facetTitle].push(`!${facetItem.isoCode}`);
        } else {
          filters[facetTitle].push(
            `!${facetItem.keyAsString ?? facetItem.key.toString()}`,
          );
        }
      }
    });
    if (filters[facetTitle].length === 0) {
      const { [facetTitle]: _, ...updatedFilters } = filters;
      filters = updatedFilters;
    }
    searchParams.setFilters(filters);
    searchParams.setPage(1);
    searchParams.setLastAppliedFacet(facetTitle);

    history.populateCurrentRequest({
      date: Date.now(),
      searchParams,
    });

    resetSelectedExcludedDocuments();
    router.push(`/results?${searchParams.toString()}`);
  };

  const toggleFacet = (facetTitle: string, facetItemValue?: string) => {
    const newFacetsList = { ...facetsList };
    const facetItem = newFacetsList[facetTitle]?.find(
      (facetItem) =>
        facetItem.key === facetItemValue ||
        facetItem.keyAsString === facetItemValue,
    );
    if (facetItem != null) {
      facetItem.selected = facetItem.excluded
        ? facetItem.selected
        : !facetItem.selected;
      facetItem.excluded = false;
    }
    setFacetsList(newFacetsList);
    setFacetsWaitingForApply([...facetsWaitingForApply, facetTitle]);
  };

  const setRangeFacet = (facetTitle: string, facetRangeValue: string) => {
    const newFacetsList = { ...facetsList };
    const newFacetItems = newFacetsList[facetTitle];
    if (newFacetItems == null) {
      return;
    }

    newFacetItems[0].selected = true;
    newFacetItems[0].key = facetRangeValue;
    setFacetsList(newFacetsList);
    setFacetsWaitingForApply([...facetsWaitingForApply, facetTitle]);
  };

  const context = {
    facetsList,
    clearOneFacet,
    clearAllFacets,
    applyOneFacet,
    toggleFacet,
    setRangeFacet,
    facetsWaitingForApply,
  };
  return (
    <FacetContext.Provider value={context}>{children}</FacetContext.Provider>
  );
};

export function useFacetContext() {
  const context = React.useContext(FacetContext);

  if (context == null) {
    throw new Error("useFacetContext must be within a FacetProvider");
  }

  return context;
}
