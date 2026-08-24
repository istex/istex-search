import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { type Locale, useLocale, useTranslations } from "next-intl";
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

  const renderValue = () => (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
      <Image src={globeIcon} alt="" />
      <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
        {locale.substring(0, 2).toUpperCase()}
      </Typography>
    </Stack>
  );

  return (
    <FormControl>
      <InputLabel id="locale-picker-label" sx={{ display: "none" }}>
        {t("selectAriaLabel")}
      </InputLabel>
      <Select
        id="locale-picker"
        labelId="locale-picker-label"
        size="small"
        value={locale}
        onChange={onLocaleChange}
        renderValue={renderValue}
        sx={{
          ...smallFontSize,
          bgcolor: "white",
          flexGrow: 1,
          "& .MuiSelect-select": {
            py: 0,
          },
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
    </FormControl>
  );
}

export function LocalePickerLoadingSkeleton() {
  return (
    <Stack
      direction="row"
      spacing={1}
      component={Paper}
      elevation={0}
      sx={{
        alignItems: "center",
        px: 1.75,
        border: "1px solid rgba(0, 0, 0, 0.23)",
      }}
    >
      <Skeleton variant="circular" width={24} height={24} />
      <Skeleton variant="text" width="5ch" />
    </Stack>
  );
}
