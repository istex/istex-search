"use client";

import { useLocale, useTranslations } from "next-intl";
import { Box } from "@mui/material";
import Button from "@/components/Button";
import NextIntlLink from "@/i18n/next-intl-link";
import useSearchParams from "@/lib/useSearchParams";
import type { ServerComponent } from "@/types/next";

const DownloadButton: ServerComponent<{ size: number }> = ({ size }) => {
  const t = useTranslations("results");
  const locale = useLocale();
  const searchParams = useSearchParams();

  searchParams.setSize(size);

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
        href={`/download?${searchParams.toString()}`}
        LinkComponent={NextIntlLink}
        size="large"
        sx={{ px: 8, py: 2 }}
      >
        {t("downloadButton", {
          size: size.toLocaleString(locale),
        })}
      </Button>
    </Box>
  );
};

export default DownloadButton;
