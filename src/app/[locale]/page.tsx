import CorpusSection from "./components/CorpusSection";
import CourseSection from "./components/CourseSection";
import DownloadSection from "./components/DownloadSection";
import type { Page } from "@/types/next";

const HomePage: Page = () => (
  <>
    <CorpusSection />
    <DownloadSection />
    <CourseSection />
  </>
);

export default HomePage;
