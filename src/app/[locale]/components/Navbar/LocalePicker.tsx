import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { type Locale, useLocale, useTranslations } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";

const smallFontSize = {
  fontSize: "0.625rem",
};

export default function LocalePicker() {
  const t = useTranslations("home.Navbar.LocalePicker");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const languageLabels = new Intl.DisplayNames([locale], {
    type: "language",
  });

  const onLocaleChange = (event: SelectChangeEvent<Locale>) => {
    router.push(`${pathname}?${searchParams.toString()}`, {
      locale: event.target.value,
    });
  };

  return (
    <Select
      size="small"
      value={locale}
      onChange={onLocaleChange}
      inputProps={{ "aria-label": t("selectAriaLabel") }}
      sx={{
        ...smallFontSize,
        bgcolor: "white",
      }}
    >
      {routing.locales.map((locale) => {
        // We only want to labelize the languages, not the full locale. Locales follow
        // the <lang-COUNTRY> format, so the language portion is the first 2 characters
        const language = locale.substring(0, 2);

        return (
          <MenuItem key={locale} value={locale} sx={smallFontSize}>
            {languageLabels.of(language)}
          </MenuItem>
        );
      })}
    </Select>
  );
}
