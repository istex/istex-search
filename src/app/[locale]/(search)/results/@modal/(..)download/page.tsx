import DownloadModal from "./DownloadModal";
import DownloadForm from "@/app/[locale]/download/components/DownloadForm";
import { getResultsCount } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import type { Page } from "@/types/next";

const DownloadPage: Page = async ({ searchParams: nextSearchParams }) => {
  const searchParams = useSearchParams(nextSearchParams);
  const queryString = searchParams.getQueryString();
  const resultsCount = await getResultsCount(queryString);

  return (
    <DownloadModal>
      <DownloadForm resultsCount={resultsCount} />
    </DownloadModal>
  );
};

export default DownloadPage;
