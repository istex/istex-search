"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box } from "@mui/material";
import HelpModal from "./HelpModal";
import HelpIcon from "@/../public/help-icon.svg";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

const HelpButton: ClientComponent = () => {
  const t = useTranslations("help");

  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const openHelpModal = () => {
    setHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setHelpModalOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          overflow: "hidden",
          position: "fixed",
          bottom: "2.5rem",
          right: "4.5rem",
          zIndex: 1,
        }}
      >
        <Box display="flex" alignItems="center">
          <Box
            sx={(theme) => ({
              p: "0.62rem",
              borderRadius: "0.3125rem",
              backgroundColor: theme.palette.colors.veryLightGreen,
              height: "2.4rem",
              mr: "-0.62rem",
              zIndex: 2,
            })}
          >
            <Image src={HelpIcon} alt="need-help" />
          </Box>
          <Button
            mainColor="lightGreen"
            sx={(theme) => ({
              color: theme.palette.colors.white,
              fontWeight: 700,
              p: "1.25rem",
              borderRadius: "0.3125rem",
              pointerEvents: "auto",
            })}
            onClick={openHelpModal}
          >
            {t("button")}
          </Button>
        </Box>
      </Box>
      <HelpModal open={helpModalOpen} onClose={closeHelpModal} />
    </>
  );
};

export default HelpButton;
