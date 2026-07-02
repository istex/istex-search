import { Alert, type AlertProps, AlertTitle, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { ARCHIVE_SIZE_THRESHOLD_ERROR } from "@/config";
import { bytesToSize } from "@/lib/utils";

const ONE_GIGABYTE = 1 * 1024 * 1024 * 1024;

interface ArchiveSizeWarningProps {
  size: number;
}

export default function ArchiveSizeWarning({ size }: ArchiveSizeWarningProps) {
  const t = useTranslations("download.ArchiveSizeWarning");
  const locale = useLocale();
  const severity: AlertProps["severity"] =
    size >= ARCHIVE_SIZE_THRESHOLD_ERROR ? "error" : "warning";

  return (
    <Alert severity={severity}>
      <AlertTitle>{t("title")}</AlertTitle>
      <Typography variant="body2">
        {t("message", { size: bytesToSize(size * ONE_GIGABYTE, locale) })}
      </Typography>
    </Alert>
  );
}
