"use client";

import { useTranslations } from "next-intl";
import { Alert, AlertTitle, Typography } from "@mui/material";
import type { ClientComponent } from "@/types/next";

const supportedCodes = [400];

const ErrorCard: ClientComponent<{ code?: number }> = ({ code }) => {
  const t = useTranslations("ErrorCard");
  const isCodeSupported = code != null && supportedCodes.includes(code);

  return (
    <Alert severity="error">
      <AlertTitle>{t("title")}</AlertTitle>
      <Typography variant="body2">
        {isCodeSupported ? `${t(code.toString())} (${code})` : t("default")}
      </Typography>
    </Alert>
  );
};

export default ErrorCard;
