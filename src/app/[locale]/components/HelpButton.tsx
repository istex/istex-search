"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box } from "@mui/material";
import HelpModal from "./HelpModal";
import HelpIcon from "@/../public/help-icon.svg";
import Button from "@/components/Button";

export default function HelpButton() {
  const t = useTranslations("help");

  const [helpModalOpen, setHelpModalOpen] = React.useState(false);

  const openHelpModal = () => {
    setHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setHelpModalOpen(false);
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          position: "sticky",
          bottom: theme.spacing(4),
          zIndex: 1,
          pointerEvents: "none",
        })}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            mr: { sm: 6, xs: 1 },
          }}
        >
          <Box
            sx={(theme) => ({
              p: "0.62rem",
              borderRadius: "0.3125rem",
              backgroundColor: theme.vars.palette.colors.lightGreen,
              height: "2.4rem",
              mr: "-0.62rem",
              zIndex: 2,
            })}
          >
            <Image src={HelpIcon} alt="" />
          </Box>
          <Button
            mainColor="darkGreen"
            sx={(theme) => ({
              fontWeight: "bold",
              p: theme.spacing(1.5),
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
}
