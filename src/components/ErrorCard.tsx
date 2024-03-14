"use client";

import { useTranslations } from "next-intl";
import { Alert, AlertTitle, Typography } from "@mui/material";
import type { CustomErrorInfo } from "@/lib/CustomError";
import type { ClientComponent } from "@/types/next";

const ErrorCard: ClientComponent<CustomErrorInfo> = (props) => {
  const t = useTranslations("ErrorCard");
  const tErrors = useTranslations("errors");
  const { name, ...translationValues } = props;

  return (
    <Alert severity="error">
      <AlertTitle>{t("title")}</AlertTitle>
      <Typography variant="body2">
        {tErrors(name, translationValues)}
      </Typography>
    </Alert>
  );
};

export default ErrorCard;
