import { getTranslator } from "next-intl/server";
import { Container } from "@mui/material";
import DownloadForm from "./components/DownloadForm";
import { getResults } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import type { GenerateMetadata, Page } from "@/types/next";

async function getActualSize(queryString: string) {
  // We send the same request as the results even thought we
  // just need the total to hit the Next.js cache went we were
  // on the results page before
  const response = await getResults(queryString);

  return response.total;
}

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
  const actualSize = await getActualSize(queryString);

  return (
    <Container sx={{ py: 6 }}>
      <DownloadForm actualSize={actualSize} />
    </Container>
  );
};

export default DownloadPage;
