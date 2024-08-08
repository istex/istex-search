import { useTranslations } from "next-intl";
import { useSearchParams as nextUseSearchParams } from "next/navigation";
import SearchParams from "./SearchParams";
import { istexApiConfig } from "@/config";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { usePathname } from "@/i18n/navigation";
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

export function useMaxSize() {
  const { resultsCount } = useQueryContext();
  const { selectedDocuments, excludedDocuments } = useDocumentContext();

  const documentsCount =
    selectedDocuments.length > 0
      ? selectedDocuments.length
      : resultsCount - excludedDocuments.length;

  return clamp(documentsCount, 0, istexApiConfig.maxSize);
}
