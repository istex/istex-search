import * as React from "react";
import { QueryProvider } from "@/contexts/QueryContext";
import type { IstexApiResponse } from "@/lib/istexApi";
import CorpusSection from "./components/CorpusSection";
import CourseSection from "./components/CourseSection";
import DownloadSection from "./components/DownloadSection";
import SearchSection, {
  SearchSectionLoadingSkeleton,
} from "./components/SearchSection/SearchSection";

export default async function HomePage() {
  const emptyQueryString = "";
  const emptyResults: IstexApiResponse = {
    total: 0,
    hits: [],
    aggregations: {},
  };

  return (
    <>
      <QueryProvider queryString={emptyQueryString} results={emptyResults}>
        <React.Suspense fallback={<SearchSectionLoadingSkeleton />}>
          <SearchSection />
        </React.Suspense>
      </QueryProvider>
      <CorpusSection />
      <DownloadSection />
      <CourseSection />
    </>
  );
}
