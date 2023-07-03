import CorpusSection from "./components/CorpusSection";
import DownloadSection from "./components/DownloadSection";
import CourseSection from "./components/CourseSection";
import type { Page } from "@/types/next";

const HomePage: Page = () => (
  <>
    <CorpusSection />
    <DownloadSection />
    <CourseSection />
  </>
);

export default HomePage;
