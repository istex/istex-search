import DownloadModal from "./DownloadModal";
import DownloadForm from "@/app/[locale]/download/components/DownloadForm";
import type { Page } from "@/types/next";

const DownloadPage: Page = () => {
  return (
    <DownloadModal>
      <div>
        <DownloadForm />
      </div>
    </DownloadModal>
  );
};

export default DownloadPage;
