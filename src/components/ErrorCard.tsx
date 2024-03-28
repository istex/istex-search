import { useTranslations } from "next-intl";
import { Alert, AlertTitle, Typography, type AlertProps } from "@mui/material";
import type { CustomErrorInfo } from "@/lib/CustomError";
import type { ServerComponent } from "@/types/next";

interface ErrorCardProps extends Omit<AlertProps, "severity"> {
  info: CustomErrorInfo;
}

const ErrorCard: ServerComponent<ErrorCardProps> = (props) => {
  const t = useTranslations("ErrorCard");
  const tErrors = useTranslations("errors");
  const { info, ...rest } = props;
  const { name, ...translationValues } = info;

  return (
    <Alert severity="error" {...rest}>
      <AlertTitle>{t("title")}</AlertTitle>
      <Typography variant="body2">
        {tErrors(name, translationValues)}
      </Typography>
    </Alert>
  );
};

export default ErrorCard;
