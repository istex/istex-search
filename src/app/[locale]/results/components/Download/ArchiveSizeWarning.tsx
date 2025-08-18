import { useTranslations } from "next-intl";
import { Alert, AlertTitle, Typography, type AlertProps } from "@mui/material";
import { ARCHIVE_SIZE_THRESHOLD_ERROR } from "@/config";

interface ArchiveSizeWarningProps {
  size: number;
}

export default function ArchiveSizeWarning({ size }: ArchiveSizeWarningProps) {
  const t = useTranslations("download.ArchiveSizeWarning");
  const severity: AlertProps["severity"] =
    size >= ARCHIVE_SIZE_THRESHOLD_ERROR ? "error" : "warning";

  return (
    <Alert severity={severity}>
      <AlertTitle>{t("title")}</AlertTitle>
      <Typography variant="body2">
        {t("message", { sizeInGigabytes: size })}
      </Typography>
    </Alert>
  );
}
