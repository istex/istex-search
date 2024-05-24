"use client";

import { useTranslations } from "next-intl";
import { SvgIcon } from "@mui/material";
import FloatingSideButton from "./FloatingSideButton";
import ShareIcon from "@/../public/share.svg?svgr";
import { useOnHomePage, useShare } from "@/lib/hooks";

export default function ShareButton() {
  const t = useTranslations("results.FloatingSideMenu");
  const onHomePage = useOnHomePage();
  const share = useShare();

  const handleShareButton = () => {
    share(new URL(window.location.href));
  };

  if (onHomePage) {
    return null;
  }

  return (
    <FloatingSideButton
      id="share-button"
      icon={<SvgIcon component={ShareIcon} />}
      label={t("shareButton")}
      onClick={handleShareButton}
    />
  );
}
