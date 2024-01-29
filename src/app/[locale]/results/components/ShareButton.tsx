"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box } from "@mui/material";
import ShareIcon from "@/../public/share.svg";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

const DownloadButton: ClientComponent = () => {
  const t = useTranslations("share");

  const handleShareButton = () => {
    if (typeof window !== "undefined") {
      window.location.href =
        "mailto:?subject=" +
        encodeURIComponent(t("email.subject")) +
        "&body=" +
        encodeURIComponent(t("email.body", { url: window.location.href }));
    }
  };

  return (
    <>
      <Box
        sx={{
          overflow: "hidden",
          position: "fixed",
          top: "50%",
          right: "0px",
          zIndex: 1,
        }}
      >
        <Button
          id="share-button"
          size="small"
          startIcon={<Image width="18" src={ShareIcon} alt="share icon" />}
          sx={{
            transition: "transform 1s",
            textTransform: "none",
            transform: "translatex(calc(100% - 30px))",
            "&:hover": {
              transform: "translatex(0)",
            },
          }}
          onClick={handleShareButton}
        >
          {t("button")}
        </Button>
      </Box>
    </>
  );
};

export default DownloadButton;
