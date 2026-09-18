import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Options } from "nuqs/server";
import { istexApiConfig } from "@/config";
import {
  resetSelectedExcludedDocuments,
  useDocumentContext,
} from "@/contexts/DocumentContext";
import { setCurrentRequestInLocalStorage } from "@/contexts/HistoryContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type AST, astContainsField } from "@/lib/ast";
import type { Field } from "@/lib/fields";
import { getAggregation } from "@/lib/istexApi";
import { clamp } from "@/lib/utils";
import {
  generateQIdFromQueryString,
  type SearchParams,
  serializeSearchParams,
  useFilters,
  useRawPagination,
  useRawSize,
} from "./searchParams";

export function useGoToResultsPage() {
  const router = useRouter();
  const baseSearchParams = useSearchParams();

  return async (queryString: string, overriddenSearchParams?: SearchParams) => {
    const finalSearchParams: SearchParams = {
      ...baseSearchParams,
      ...overriddenSearchParams,
      size: null,
      page: null,
      filters: null,
      randomSeed: null,
    };

    if (queryString.length > istexApiConfig.queryStringMaxLength) {
      finalSearchParams.queryString = null;
      finalSearchParams.qId = await generateQIdFromQueryString(queryString);
    } else {
      finalSearchParams.queryString = queryString;
      finalSearchParams.qId = null;
    }

    const query = serializeSearchParams(finalSearchParams);

    const queryWithoutLeadingQuestionMark = query.substring(1);
    setCurrentRequestInLocalStorage({
      date: Date.now(),
      searchParams: queryWithoutLeadingQuestionMark,
    });

    resetSelectedExcludedDocuments();
    router.push(`/results${query}`);
  };
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
  const [rawSize, setSize] = useRawSize();
  const maxSize = useMaxSize();

  return [
    rawSize !== 0 ? clamp(rawSize, 0, maxSize) : maxSize,
    setSize,
  ] as const;
}

export function usePagination() {
  const { results } = useQueryContext();
  const maxResults = clamp(
    results.total,
    0,
    istexApiConfig.maxPaginationOffset,
  );

  const {
    page: rawPage,
    perPage,
    setPage: setRawPage,
    setPerPage,
  } = useRawPagination();
  const lastPage = Math.max(0, Math.ceil(maxResults / perPage) - 1);
  const page = clamp(rawPage, 0, lastPage);

  const setPage = (newPage: number | null, options?: Options) => {
    setRawPage(
      newPage != null ? clamp(newPage, 0, lastPage) : newPage,
      options,
    );
  };

  return { page, perPage, lastPage, setPage, setPerPage };
}

export function useApplyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (filters: AST) => {
    const query = serializeSearchParams(searchParams, {
      size: null,
      page: null,
      randomSeed: null,
      filters: filters.length > 0 ? filters : null,
    });

    const queryWithoutLeadingQuestionMark = query.substring(1);
    setCurrentRequestInLocalStorage({
      date: Date.now(),
      searchParams: queryWithoutLeadingQuestionMark,
    });

    resetSelectedExcludedDocuments();
    router.push(`/results${query}`);
  };
}

export function useAggregationQuery(field: Field) {
  const [filters] = useFilters();
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
