"use client";

import { useLocale, useTranslations } from "next-intl";
import { Box } from "@/mui/material";
import Button from "@/components/Button";
import NextIntlLink from "@/i18n/next-intl-link";
import useSearchParams from "@/lib/useSearchParams";
import type { ServerComponent } from "@/types/next";

const DownloadButton: ServerComponent<{ numberOfDocuments: number }> = ({
  numberOfDocuments,
}) => {
  const t = useTranslations("results");
  const searchParams = useSearchParams();
  const locale = useLocale();

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        top: "85dvh",
        width: "100vw",
        textAlign: "center",
        zIndex: 1,
      }}
    >
      <Button
        mainColor="blue"
        secondaryColor="white"
        href={`/download?${searchParams.toString()}`}
        LinkComponent={NextIntlLink}
        size="large"
        sx={{ px: 8, py: 2 }}
      >
        {t("downloadButton", {
          numberOfDocuments: numberOfDocuments.toLocaleString(locale),
        })}
      </Button>
    </Box>
  );
};

export default DownloadButton;
