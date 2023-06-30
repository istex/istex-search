import CorpusSection from "./CorpusSection";
import DownloadSection from "./DownloadSection";
import CourseSection from "./CourseSection";
import type { Page } from "@/types/next";

const HomePage: Page = () => (
  <>
    <CorpusSection />
    <DownloadSection />
    <CourseSection />
  </>
);

export default HomePage;
