import DownloadModal from "./DownloadModal";
import DownloadForm from "@/app/[locale]/download/components/DownloadForm";
import { istexApiConfig } from "@/config";
import useSearchParams from "@/lib/useSearchParams";
import type { Page } from "@/types/next";

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

const DownloadPage: Page = async ({ searchParams: nextSearchParams }) => {
  const searchParams = useSearchParams(nextSearchParams);
  const queryString = searchParams.getQueryString();
  const actualSize = await getActualSize(queryString);

  return (
    <DownloadModal>
      <DownloadForm actualSize={actualSize} />
    </DownloadModal>
  );
};

export default DownloadPage;
