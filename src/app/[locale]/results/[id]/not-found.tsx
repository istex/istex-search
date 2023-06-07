import { useTranslations } from "next-intl";
import { Alert, AlertTitle, Box } from "@/mui/material";
import type { ServerComponent } from "@/types/next";

const NotFound: ServerComponent = () => {
  const t = useTranslations("NotFound");

  return (
    <Box>
      <Alert severity="error">
        <AlertTitle>{t("title")}</AlertTitle>
        {t("content")}
      </Alert>
    </Box>
  );
};

export default NotFound;
