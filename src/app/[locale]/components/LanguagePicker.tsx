"use client";

import { useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { SUPPORTED_LOCALES, usePathname, useRouter } from "@/i18n/navigation";
import type { ClientComponent } from "@/types/next";

const smallFontSize = {
  fontSize: "0.625rem",
};

// This component is not used right now because only one language is supported
// but we still keep it just in case we support more languages in the future.
const LanguagePicker: ClientComponent<{ locale: string }> = ({ locale }) => {
  const [language, setLanguage] = useState(locale);
  const pathname = usePathname();
  const router = useRouter();

  const languageLabels = new Intl.DisplayNames([locale], {
    type: "language",
  });

  const onLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
    router.push(pathname ?? "", { locale: event.target.value });
  };

  return (
    <Box>
      <FormControl size="small" sx={{ m: 1, minWidth: "15ch" }}>
        <InputLabel id="language-select-label" sx={smallFontSize}>
          Langue
        </InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          label="Langue"
          value={language}
          onChange={onLanguageChange}
          sx={smallFontSize}
        >
          {SUPPORTED_LOCALES.map((locale) => (
            <MenuItem key={locale} value={locale} sx={smallFontSize}>
              {languageLabels.of(locale)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguagePicker;
