"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import FloatingSideButton from "./FloatingSideButton";
import ShareIcon from "@/../public/share.svg";
import { usePathname } from "@/i18n/routing";
import { useShare } from "@/lib/hooks";

export default function ShareButton() {
  const t = useTranslations("FloatingSideMenu");
  const onResultsPage = usePathname() === "/results";
  const share = useShare();

  const handleShareButton = () => {
    share("corpus", new URL(window.location.href));
  };

  if (!onResultsPage) {
    return null;
  }

  return (
    <FloatingSideButton
      id="share-button"
      icon={<Image src={ShareIcon} width={18} height={18} alt="" />}
      label={t("shareButton")}
      onClick={handleShareButton}
    />
  );
}
