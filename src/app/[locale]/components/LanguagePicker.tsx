"use client";

import { useState } from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@/mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { SUPPORTED_LOCALES } from "@/i18n/constants";
import type { ClientComponent } from "@/types/next";

const smallFontSize = {
  fontSize: "0.625rem",
};

// This component is not used right now because only one language is supported
// but we still keep it just in case we support more languages in the future.
const LanguagePicker: ClientComponent<{ locale: string }> = ({ locale }) => {
  const [language, setLanguage] = useState(locale);
  const urlSegment = useSelectedLayoutSegment();
  const router = useRouter();

  const onLanguageChange = (event: SelectChangeEvent): void => {
    setLanguage(event.target.value);
    router.push(`${event.target.value}/${urlSegment ?? ""}`);
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
          {SUPPORTED_LOCALES.map(({ code, label }) => (
            <MenuItem key={code} value={code} sx={smallFontSize}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguagePicker;
