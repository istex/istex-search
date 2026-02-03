import { Alert, type AlertProps, AlertTitle, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type { CustomErrorInfo } from "@/lib/CustomError";

interface ErrorCardProps extends Omit<AlertProps, "severity"> {
  info: CustomErrorInfo;
  disableTitle?: boolean;
}

export default function ErrorCard(props: ErrorCardProps) {
  const t = useTranslations("ErrorCard");
  const tErrors = useTranslations("errors");
  const { info, disableTitle = false, ...rest } = props;
  const { name, ...translationValues } = info;

  return (
    <Alert severity="error" {...rest}>
      {!disableTitle && <AlertTitle>{t("title")}</AlertTitle>}
      <Typography variant="body2">
        {tErrors(name, translationValues)}
      </Typography>
    </Alert>
  );
}
