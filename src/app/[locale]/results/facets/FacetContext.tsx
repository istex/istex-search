"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next-intl/client";
import useSearchParams from "@/lib/useSearchParams";
import { type ClientComponent } from "@/types/next";

export interface FacetItem {
  key: string;
  docCount: number;
  selected?: boolean;
}

export type FacetList = Record<string, FacetItem[]>;

export interface FacetContextValue {
  facetsList: FacetList | undefined;
  clearOneFacet: (facetTitle: string) => void;
  clearAllFacets: () => void;
  applyOneFacet: (facetTitle: string) => void;
  toggleFacet: (facetTitle: string, facetItemValue: string) => void;
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
    const newFacetsList = { ...facetsList };
    newFacetsList[facetTitle].forEach((facetItem) => {
      facetItem.selected = false;
    });
    setFacetsList(newFacetsList);
  };

  const clearAllFacets = () => {
    const newFacetsList = { ...facetsList };
    Object.keys(newFacetsList).forEach((facetTitle) => {
      newFacetsList[facetTitle].forEach((facetItem) => {
        facetItem.selected = false;
      });
    });
    setFacetsList(newFacetsList);
  };

  const applyOneFacet = async (facetTitle: string) => {
    const queryString = await searchParams.getQueryString();
    if (facetsList != null) {
      const appliedFacets = facetsList[facetTitle]
        .filter((facetItem) => facetItem.selected)
        .map((facetItem) => `"${facetItem.key}"`);
      const newQueryString = `${queryString} AND ${facetTitle}:(${appliedFacets.join(
        " OR ",
      )})`;
      await searchParams.setQueryString(newQueryString);
      router.push(`/results?${searchParams.toString()}`);
    }
  };

  const toggleFacet = (facetTitle: string, facetItemValue: string) => {
    const newFacetsList = { ...facetsList };
    newFacetsList[facetTitle].forEach((facetItem) => {
      if (facetItem.key === facetItemValue) {
        facetItem.selected = !(facetItem.selected ?? false);
      }
    });
    setFacetsList(newFacetsList);
  };

  const context = {
    facetsList,
    clearOneFacet,
    clearAllFacets,
    applyOneFacet,
    toggleFacet,
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
