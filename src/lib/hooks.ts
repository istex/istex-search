import { useTranslations } from "next-intl";
import { useSearchParams as nextUseSearchParams } from "next/navigation";
import SearchParams from "./SearchParams";
import { istexApiConfig } from "@/config";
import {
  resetSelectedExcludedDocuments,
  useDocumentContext,
} from "@/contexts/DocumentContext";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { useRouter } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import type { AST } from "@/lib/ast";
import { clamp } from "@/lib/utils";
import type { NextSearchParams } from "@/types/next";

export function useSearchParams(searchParams?: NextSearchParams) {
  return new SearchParams(searchParams ?? nextUseSearchParams());
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
