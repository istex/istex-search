"use client";

import { useTranslations } from "next-intl";
import ShareIcon from "@mui/icons-material/Reply";
import FloatingSideButton from "./FloatingSideButton";
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
      icon={<ShareIcon style={{ transform: "scaleX(-1.3) scaleY(1.3)" }} />}
      label={t("shareButton")}
      onClick={handleShareButton}
    />
  );
}
