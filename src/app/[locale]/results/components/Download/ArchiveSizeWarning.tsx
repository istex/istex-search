import { useLocale, useTranslations } from "next-intl";
import { Alert, AlertTitle, Typography, type AlertProps } from "@mui/material";
import { lighten } from "@mui/system/colorManipulator";
import { ARCHIVE_SIZE_THRESHOLD_ERROR } from "@/config";

interface ArchiveSizeWarningProps {
  size: number;
}

export default function ArchiveSizeWarning({ size }: ArchiveSizeWarningProps) {
  const t = useTranslations("download.ArchiveSizeWarning");
  const locale = useLocale();
  const severity: AlertProps["severity"] =
    size >= ARCHIVE_SIZE_THRESHOLD_ERROR ? "error" : "warning";

  return (
    <Alert
      severity={severity}
      sx={(theme) => ({
        // We need to apply the default background color again and add !important because it is normally
        // overwritten by other css rule. The default color is calculated here:
        // https://github.com/mui/material-ui/blob/next/packages/mui-material/src/Alert/Alert.js#L70
        bgcolor: `${lighten(theme.palette[severity].light, 0.9)} !important`,
      })}
    >
      <AlertTitle>{t("title")}</AlertTitle>
      <Typography variant="body2">
        {t("message", { sizeInGigabytes: size.toLocaleString(locale) })}
      </Typography>
    </Alert>
  );
}
