import { getTranslator } from "next-intl/server";
import { Container } from "@mui/material";
import DownloadForm from "./components/DownloadForm";
import { getResultsCount } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import type { GenerateMetadata, Page } from "@/types/next";

export const generateMetadata: GenerateMetadata = async ({
  params: { locale },
}) => {
  const t = await getTranslator(locale, "download.metadata");

  return {
    title: `Istex-DL - ${t("title")}`,
  };
};

const DownloadPage: Page = async ({ searchParams: nextSearchParams }) => {
  const searchParams = useSearchParams(nextSearchParams);
  const queryString = searchParams.getQueryString();
  const resultsCount = await getResultsCount(queryString);

  return (
    <Container sx={{ py: 6 }}>
      <DownloadForm resultsCount={resultsCount} displayTitle />
    </Container>
  );
};

export default DownloadPage;
