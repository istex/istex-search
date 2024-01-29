import CorpusSection from "./components/CorpusSection";
import CourseSection from "./components/CourseSection";
import DownloadSection from "./components/DownloadSection";
import SearchSection from "./components/SearchSection";
import { DocumentProvider } from "./results/Document/DocumentContext";
import { QueryProvider } from "@/contexts/QueryContext";
import { redirect } from "@/i18n/navigation";
import useSearchParams from "@/lib/useSearchParams";
import type { Page } from "@/types/next";

const HomePage: Page = async ({ searchParams: nextSearchParams }) => {
  const searchParams = useSearchParams(nextSearchParams);

  let queryString: string;
  try {
    queryString = await searchParams.getQueryString();
  } catch (err) {
    // Getting on the home page with an invalid q_id could be a mistake
    // so we just delete it and refresh the page
    searchParams.deleteQueryString();
    redirect(`/?${searchParams.toString()}`);

    // This return is unnecessary because redirect throws an error internally but
    // typescript isn't smart enough to figure that out and thinks "queryString" below
    // will be used before it's assigned.
    return null;
  }

  return (
    <QueryProvider queryString={queryString} resultsCount={0}>
      <DocumentProvider>
        <SearchSection />
        <CorpusSection />
        <DownloadSection />
        <CourseSection />
      </DocumentProvider>
    </QueryProvider>
  );
};

export default HomePage;
