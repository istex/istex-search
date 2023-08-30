"use client";

import type { MouseEventHandler } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { Box } from "@mui/material";
import Button from "@/components/Button";
import useSearchParams from "@/lib/useSearchParams";
import type { ServerComponent } from "@/types/next";

const DownloadButton: ServerComponent<{ size: number }> = ({ size }) => {
  const t = useTranslations("results");
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  searchParams.setSize(size);

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    router.push(`/download?${searchParams.toString()}`);
  };

  return (
    <Box
      sx={(theme) => ({
        position: "sticky",
        inset: 0,
        bottom: theme.spacing(8),
        textAlign: "center",
        zIndex: 1,
      })}
    >
      <Button
        id="download-button"
        size="large"
        sx={{ px: { xs: 4, sm: 8 }, py: 2 }}
        onClick={handleClick}
      >
        {t("downloadButton", {
          size: size.toLocaleString(locale),
        })}
      </Button>
    </Box>
  );
};

export default DownloadButton;
