"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import HistoryModal from "../History/HistoryModal";
import FloatingSideButton from "./FloatingSideButton";

export default function HistoryButton() {
  const t = useTranslations("results.FloatingSideMenu");
  const [openModal, setOpenModal] = React.useState(false);

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
}
