import { useTranslations } from "next-intl";
import { Alert, AlertTitle } from "@mui/material";
import type { ServerComponent } from "@/types/next";

interface ErrorCardProps {
  code?: number;
}

const ErrorCard: ServerComponent<ErrorCardProps> = ({ code }) => {
  const t = useTranslations("ErrorCard");

  return (
    <Alert severity="error">
      <AlertTitle>{t("title")}</AlertTitle>
      {t(code?.toString() ?? "default") + (code != null ? ` (${code})` : "")}
    </Alert>
  );
};

export default ErrorCard;
