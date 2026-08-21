import { Box, IconButton, Menu, MenuItem, Skeleton } from "@mui/material";
import Image from "next/image";
import { type Locale, useLocale, useTranslations } from "next-intl";
import * as React from "react";
import globeIcon from "@/../public/globe.svg";
import { usePathname, useRouter } from "@/i18n/navigation";
import routing from "@/i18n/routing";
import { useSearchParams } from "@/lib/hooks";

const smallFontSize = {
  fontSize: "0.625rem",
};

export default function LocalePicker() {
  const t = useTranslations("home.Navbar.LocalePicker");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const searchParams = useSearchParams();
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null,
  );
  const open = anchorElement != null;

  const id = React.useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;

  const openLocaleMenu: React.MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    setAnchorElement(event.currentTarget);
  };

  const closeLocaleMenu = () => {
    setAnchorElement(null);
  };

  const languageLabels = new Intl.DisplayNames([currentLocale], {
    type: "language",
  });

  const onLocaleChange = (locale: Locale) => {
    router.push(`${pathname}?${searchParams.toString()}`, {
      locale,
    });
    closeLocaleMenu();
  };

  return (
    <Box>
      <IconButton
        id={buttonId}
        title={t("buttonAriaLabel")}
        aria-label={t("buttonAriaLabel")}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={openLocaleMenu}
      >
        <Image src={globeIcon} alt="" />
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchorElement}
        open={anchorElement != null}
        onClose={closeLocaleMenu}
        slotProps={{
          list: {
            "aria-labelledby": buttonId,
          },
        }}
      >
        {routing.locales.map((locale) => {
          // We only want to labelize the languages, not the full locale. Locales follow
          // the <lang-COUNTRY> format, so the language portion is the first 2 characters
          const language = locale.substring(0, 2);

          return (
            <MenuItem
              key={locale}
              value={locale}
              selected={locale === currentLocale}
              aria-selected
              onClick={() => {
                onLocaleChange(locale);
              }}
              sx={smallFontSize}
            >
              {languageLabels.of(language)}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}

export function LocalePickerLoadingSkeleton() {
  return <Skeleton variant="circular" width={24} height={24} sx={{ m: 1 }} />;
}
