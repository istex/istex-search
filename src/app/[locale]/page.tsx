import { redirect } from "next-intl/server";
import CorpusSection from "./components/CorpusSection";
import CourseSection from "./components/CourseSection";
import DownloadSection from "./components/DownloadSection";
import SearchSection from "./components/SearchSection";
import { QueryProvider } from "@/contexts/QueryContext";
import useSearchParams from "@/lib/useSearchParams";
import type { Page } from "@/types/next";

const HomePage: Page = async ({ searchParams: nextSearchParams }) => {
  const searchParams = useSearchParams(nextSearchParams);

  let queryString: string;
  try {
    queryString = await searchParams.getQueryString();
  } catch (err) {
    // TODO: let the user know the q_id was not found
    redirect("/");
  }

  return (
    <QueryProvider queryString={queryString} resultsCount={0}>
      <SearchSection />
      <CorpusSection />
      <DownloadSection />
      <CourseSection />
    </QueryProvider>
  );
};

export default HomePage;
