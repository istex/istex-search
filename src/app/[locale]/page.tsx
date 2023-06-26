import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { Container, Link, Typography } from "@/mui/material";
import CorpusSection from "./components/CorpusSection";
import DownloadSection from "./components/DownloadSection";
import CourseSection from "./components/CourseSection";
import type { Page } from "@/types/next";

const HomePage: Page = () => {
  const t = useTranslations("Home");

  return (
    <>
      {/* Test title and link, TODO: replace with search input when ready */}
      <Container component="section">
        <Typography variant="h3" py={3}>
          {t("title")}
        </Typography>
        <Link href="/results" component={NextLink}>
          {t("goToResults")}
        </Link>
      </Container>

      <CorpusSection />
      <DownloadSection />
      <CourseSection />
    </>
  );
};

export default HomePage;
