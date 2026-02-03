import { useQuery } from "@tanstack/react-query";
import { useSearchParams as nextUseSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";
import { istexApiConfig } from "@/config";
import {
  resetSelectedExcludedDocuments,
  useDocumentContext,
} from "@/contexts/DocumentContext";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { usePathname, useRouter } from "@/i18n/routing";
import { type AST, astContainsField } from "@/lib/ast";
import type { Field } from "@/lib/fields";
import { getAggregation } from "@/lib/istexApi";
import { clamp } from "@/lib/utils";
import SearchParams from "./SearchParams";

export function useSearchParams() {
  const params = nextUseSearchParams();

  return React.useMemo(() => new SearchParams(params), [params]);
}

export function useOnHomePage() {
  return usePathname() === "/";
}

export function useShare() {
  const t = useTranslations("results.Share.email");

  return (type: "corpus" | "document", url: URL) => {
    if (typeof window !== "undefined") {
      window.location.href =
        "mailto:?subject=" +
        encodeURIComponent(t(`${type}.subject`)) +
        "&body=" +
        encodeURIComponent(t(`${type}.body`, { url: url.href }));
    }
  };
}

export function useDownload() {
  return (url: URL) => {
    // Hack to download the archive and see the progression in the download bar built in browsers
    // We create a fake 'a' tag that points to the URL we just built and simulate a click on it
    const link = document.createElement("a");
    link.href = url.toString();

    // These attributes are set to open the URL in another tab, this is useful when the user is
    // redirected to the identity federation page so that they don't lose the current page
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");

    link.click();
  };
}

export function useDocumentCount() {
  const { results } = useQueryContext();
  const { selectedDocuments, excludedDocuments } = useDocumentContext();

  return selectedDocuments.length > 0
    ? selectedDocuments.length
    : results.total - excludedDocuments.length;
}

export function useMaxSize() {
  const documentCount = useDocumentCount();

  return clamp(documentCount, 0, istexApiConfig.maxSize);
}

export function useSize() {
  const searchParams = useSearchParams();
  const sizeFromSearchParams = searchParams.getSize();
  const maxSize = useMaxSize();

  return sizeFromSearchParams !== 0
    ? clamp(sizeFromSearchParams, 0, maxSize)
    : maxSize;
}

export function useApplyFilters() {
  const router = useRouter();
  const history = useHistoryContext();
  const searchParams = useSearchParams();

  return (filters: AST) => {
    searchParams.deleteSize();
    searchParams.deletePage();
    searchParams.deleteRandomSeed();

    if (filters.length > 0) {
      searchParams.setFilters(filters);
    } else {
      searchParams.deleteFilters();
    }

    history.populateCurrentRequest({
      date: Date.now(),
      searchParams,
    });

    resetSelectedExcludedDocuments();
    router.push(`/results?${searchParams.toString()}`);
  };
}

export function useAggregationQuery(field: Field) {
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const { queryString, results } = useQueryContext();

  // If filters are active, send a request if the field is NOT one of them,
  // otherwise, send a request if the field is not open by default.
  // When a field is part of an active filter or open by default, its aggregation
  // is part of the main request run on the server, the one used to generate the
  // results page
  const enabled =
    filters.length > 0
      ? !astContainsField(filters, field)
      : field.defaultOpen == null || !field.defaultOpen;

  // If we don't need to send a request, we just make the query return the
  // aggregation from the main request
  const placeholderData = !enabled
    ? results.aggregations[field.name].buckets
    : undefined;

  return useQuery({
    queryKey: ["aggregation", field.name, queryString, filters],
    queryFn: async () => await getAggregation(field, queryString, filters),
    enabled,
    placeholderData,
  });
}
