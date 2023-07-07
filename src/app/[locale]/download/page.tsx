import { getTranslations } from "next-intl/server";
import { Container } from "@/mui/material";
import DownloadForm from "./components/DownloadForm";
import type { GenerateMetadata, Page } from "@/types/next";

export const generateMetadata: GenerateMetadata = async () => {
  const t = await getTranslations("download.metadata");

  return {
    title: `Istex-DL - ${t("title")}`,
  };
};

const DownloadPage: Page = () => {
  return (
    <Container sx={{ py: 6 }}>
      <div>
        <DownloadForm />
      </div>
    </Container>
  );
};

export default DownloadPage;
