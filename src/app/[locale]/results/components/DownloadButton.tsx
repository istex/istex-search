"use client";

import { type MouseEventHandler, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next-intl/client";
import { Box } from "@mui/material";
import DownloadForm from "../Download/DownloadForm";
import DownloadModal from "../Download/DownloadModal";
import Button from "@/components/Button";
import { useQueryContext } from "@/contexts/QueryContext";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const DownloadButton: ClientComponent = () => {
  const t = useTranslations("results");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const size = searchParams.getSize();
  const { resultsCount } = useQueryContext();
  const [modalOpen, setModalOpen] = useState(false);

  const openModal: MouseEventHandler<HTMLButtonElement> = () => {
    // If the size is not set, make it the result count by default
    // NOTE: It's not the best solution in terms of performance because it implies
    // re-rendering the whole /results page just to change the size
    if (size === 0) {
      searchParams.setSize(resultsCount);
      router.replace(`${pathname}?${searchParams.toString()}`, {
        scroll: false,
      });
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
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
          onClick={openModal}
        >
          {t("downloadButton")}
        </Button>
      </Box>

      <DownloadModal open={modalOpen} onClose={closeModal}>
        <DownloadForm />
      </DownloadModal>
    </>
  );
};

export default DownloadButton;
