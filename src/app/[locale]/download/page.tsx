import { getTranslator } from "next-intl/server";
import { Container } from "@mui/material";
import DownloadForm from "./components/DownloadForm";
import { istexApiConfig } from "@/config";
import useSearchParams from "@/lib/useSearchParams";
import type { GenerateMetadata, Page } from "@/types/next";

interface IstexApiResponse {
  total: number;
}

async function getActualSize(queryString: string) {
  const url = new URL("document", istexApiConfig.baseUrl);
  url.searchParams.set("q", queryString);
  url.searchParams.set("size", "0");
  url.searchParams.set("sid", "istex-dl");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API responded with a ${response.status} status code!`);
  }

  const body: IstexApiResponse = await response.json();

  return body.total;
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
