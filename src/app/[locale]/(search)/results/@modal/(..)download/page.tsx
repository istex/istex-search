import DownloadModal from "./DownloadModal";
import DownloadForm from "@/app/[locale]/download/components/DownloadForm";
import { getResults } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import type { Page } from "@/types/next";

async function getActualSize(queryString: string) {
  // We send the same request as the results even thought we
  // just need the total to hit the Next.js cache went we were
  // on the results page before
  const response = await getResults(queryString);

  return response.total;
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
