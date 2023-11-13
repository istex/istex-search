"use client";

import { useTranslations } from "next-intl";
import { Alert, AlertTitle, Typography } from "@mui/material";
import type { CustomErrorInfo } from "@/lib/CustomError";
import type { ClientComponent } from "@/types/next";

const ErrorCard: ClientComponent<CustomErrorInfo> = ({ name }) => {
  const t = useTranslations("ErrorCard");
  const tErrors = useTranslations("errors");

  return (
    <Alert severity="error">
      <AlertTitle>{t("title")}</AlertTitle>
      <Typography variant="body2">{tErrors(name)}</Typography>
    </Alert>
  );
};

export default ErrorCard;
