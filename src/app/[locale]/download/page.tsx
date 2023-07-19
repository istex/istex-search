import { getTranslator } from "next-intl/server";
import { Container } from "@mui/material";
import DownloadForm from "./components/DownloadForm";
import type { GenerateMetadata, Page } from "@/types/next";

export const generateMetadata: GenerateMetadata = async ({
  params: { locale },
}) => {
  const t = await getTranslator(locale, "download.metadata");

  return {
    title: `Istex-DL - ${t("title")}`,
  };
};

const DownloadPage: Page = () => {
  return (
    <Container sx={{ py: 6 }}>
      <DownloadForm />
    </Container>
  );
};

export default DownloadPage;
