import { useTranslations } from "next-intl";
import { Box } from "@/mui/material";
import Button from "@/components/Button";
import NextIntlLink from "@/i18n/next-intl-link";
import type { NextSearchParams, ServerComponent } from "@/types/next";

const DownloadButton: ServerComponent<{ searchParams: NextSearchParams }> = ({
  searchParams,
}) => {
  const t = useTranslations("results");
  const queryString = Array.isArray(searchParams.q)
    ? searchParams.q[0]
    : searchParams.q ?? "";

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "3rem",
        textAlign: "center",
        width: "100vw",
        zIndex: 1,
      }}
    >
      <Button
        mainColor="blue"
        secondaryColor="white"
        href={`/download?${new URLSearchParams({
          q: queryString,
        }).toString()}`}
        LinkComponent={NextIntlLink}
        size="large"
        sx={{ px: 8, py: 2 }}
      >
        {t("downloadButton")}
      </Button>
    </Box>
  );
};

export default DownloadButton;
