"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import HelpIcon from "@mui/icons-material/Help";
import MemoModal from "../MemoModal";
import FloatingSideButton from "./FloatingSideButton";

export default function MemoButton() {
  const t = useTranslations("FloatingSideMenu");
  const [openModal, setOpenModal] = React.useState(false);

  const openMemo = () => {
    setOpenModal(true);
  };

  const closeMemo = () => {
    setOpenModal(false);
  };

  return (
    <>
      <FloatingSideButton
        id="memo-button"
        icon={<HelpIcon />}
        label={t("memoButton")}
        onClick={openMemo}
      />

      <MemoModal open={openModal} onClose={closeMemo} />
    </>
  );
}
