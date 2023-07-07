import { Container } from "@/mui/material";
import DownloadForm from "./components/DownloadForm";
import type { Page } from "@/types/next";

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
