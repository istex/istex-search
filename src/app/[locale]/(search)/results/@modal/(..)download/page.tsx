import DownloadModal from "./DownloadModal";
import DownloadForm from "@/app/[locale]/download/components/DownloadForm";
import { nextSearchParamsToUrlSearchParams } from "@/lib/utils";
import type { Page } from "@/types/next";

const DownloadPage: Page = ({ searchParams }) => {
  return (
    <DownloadModal>
      <DownloadForm
        searchParams={nextSearchParamsToUrlSearchParams(searchParams)}
      />
    </DownloadModal>
  );
};

export default DownloadPage;
