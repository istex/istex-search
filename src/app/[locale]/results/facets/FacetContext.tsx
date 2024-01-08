"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next-intl/client";
import useSearchParams from "@/lib/useSearchParams";
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

export type FacetList = Record<string, FacetItem[]>;

export interface FacetContextValue {
  facetsList?: FacetList;
  clearOneFacet: (facetTitle: string) => void;
  clearAllFacets: () => void;
  applyOneFacet: (facetTitle: string) => void;
  toggleFacet: (facetTitle: string, facetItemValue?: string) => void;
  setRangeFacet: (facetTitle: string, facetRangeValue: string) => void;
}

const FacetContext = createContext<FacetContextValue | null>(null);

export const FacetProvider: ClientComponent<{ facets?: FacetList }, true> = ({
  facets,
  children,
}) => {
  const [facetsList, setFacetsList] = useState<FacetList | undefined>(facets);
  const searchParams = useSearchParams();
  const router = useRouter();

  const clearOneFacet = (facetTitle: string) => {
    const filters = searchParams.getFilters();
    const { [facetTitle]: _, ...updatedFilters } = filters;
    searchParams.setFilters(updatedFilters);
    searchParams.setPage(1);
    searchParams.deleteLastAppliedFacet();
    router.push(`/results?${searchParams.toString()}`);
  };

  const clearAllFacets = () => {
    searchParams.deleteFilters();
    searchParams.setPage(1);
    searchParams.deleteLastAppliedFacet();
    router.push(`/results?${searchParams.toString()}`);
  };

  const applyOneFacet = (facetTitle: string) => {
    let filters = searchParams.getFilters();
    filters[facetTitle] = [];
    facetsList?.[facetTitle].forEach((facetItem) => {
      if (facetItem.selected) {
        if (facetTitle === "language" && facetItem.isoCode !== undefined) {
          filters[facetTitle].push(facetItem.isoCode);
        } else {
          filters[facetTitle].push(
            facetItem.keyAsString ?? facetItem.key.toString(),
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
    router.push(`/results?${searchParams.toString()}`);
  };

  const toggleFacet = (facetTitle: string, facetItemValue?: string) => {
    const newFacetsList = { ...facetsList };
    newFacetsList[facetTitle].forEach((facetItem) => {
      if (
        facetItem.key === facetItemValue ||
        facetItem.keyAsString === facetItemValue
      ) {
        facetItem.selected = facetItem.excluded
          ? facetItem.selected
          : !facetItem.selected;
        facetItem.excluded = false;
      }
    });
    setFacetsList(newFacetsList);
  };

  const setRangeFacet = (facetTitle: string, facetRangeValue: string) => {
    const newFacetsList = { ...facetsList };
    newFacetsList[facetTitle][0].selected = true;
    newFacetsList[facetTitle][0].key = facetRangeValue;
    setFacetsList(newFacetsList);
  };

  const context = {
    facetsList,
    clearOneFacet,
    clearAllFacets,
    applyOneFacet,
    toggleFacet,
    setRangeFacet,
  };
  return (
    <FacetContext.Provider value={context}>{children}</FacetContext.Provider>
  );
};

export function useFacetContext() {
  const context = useContext(FacetContext);

  if (context == null) {
    throw new Error("useFacetContext must be within a FacetContextProvider");
  }

  return context;
}
