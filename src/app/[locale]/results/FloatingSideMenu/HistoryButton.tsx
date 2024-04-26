"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import HistoryModal from "../History/HistoryModal";
import FloatingSideButton from "./FloatingSideButton";
import type { ClientComponent } from "@/types/next";

const HistoryButton: ClientComponent = () => {
  const t = useTranslations("results.FloatingSideMenu");
  const [openModal, setOpenModal] = useState(false);

  const openHistory = () => {
    setOpenModal(true);
  };

  const closeHistory = () => {
    setOpenModal(false);
  };

  return (
    <>
      <FloatingSideButton
        id="history-button"
        icon={<WatchLaterIcon />}
        label={t("historyButton")}
        onClick={openHistory}
      />

      <HistoryModal open={openModal} onClose={closeHistory} />
    </>
  );
};

export default HistoryButton;
