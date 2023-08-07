"use client";

import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Box, FormControl, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Checkbox from "@/components/Checkbox";
import { type FormatCategoryName, DEFAULT_USAGE_NAME, formats } from "@/config";
import {
  deselectFormat,
  getWholeCategoryFormat,
  isFormatSelected,
  isWholeCategorySelected,
  selectFormat,
} from "@/lib/formats";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const FormatPicker: ClientComponent = () => {
  const t = useTranslations("config.formats");
  const theme = useTheme();
  const onSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const searchParams = useSearchParams();
  const currentUsageName = searchParams.getUsageName();
  const customUsageNotSelected = currentUsageName !== DEFAULT_USAGE_NAME;

  return (
    <Grid container spacing={2} sx={{ display: "flex" }}>
      <Grid item xs={6} sm={4}>
        <FormatCategory name="fulltext" disabled={customUsageNotSelected} />
      </Grid>

      <Grid item xs={6} sm={4} container>
        <Grid item sm={12}>
          <FormatCategory name="metadata" disabled={customUsageNotSelected} />
        </Grid>

        {!onSmallScreen &&
          Object.keys(formats.others).map((category) => (
            <Grid key={category} item sm={12}>
              <Format
                label={t(`others.${category}`)}
                value={formats.others[category as keyof typeof formats.others]}
                disabled={customUsageNotSelected}
              />
            </Grid>
          ))}
      </Grid>

      <Grid item xs={6} sm={4}>
        <FormatCategory name="enrichments" disabled={customUsageNotSelected} />
      </Grid>

      {onSmallScreen && (
        <Grid item xs={6} container sx={{ alignContent: "start" }}>
          {Object.keys(formats.others).map((category) => (
            <Grid key={category} item xs={12}>
              <Format
                label={t(`others.${category}`)}
                value={formats.others[category as keyof typeof formats.others]}
                disabled={customUsageNotSelected}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

interface FormatProps {
  label: string;
  value: number;
  indeterminate?: boolean;
  disabled?: boolean;
}

const Format: ClientComponent<FormatProps> = ({
  label,
  value,
  indeterminate,
  disabled,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedFormats = searchParams.getFormats();

  const handleChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const newFormats = checked
      ? selectFormat(selectedFormats, value)
      : deselectFormat(selectedFormats, value);

    searchParams.setFormats(newFormats);

    router.replace(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Checkbox
      label={label}
      indeterminate={indeterminate}
      disabled={disabled}
      checked={isFormatSelected(selectedFormats, value)}
      onChange={handleChange}
    />
  );
};

interface FormatCategoryProps {
  name: FormatCategoryName;
  disabled?: boolean;
}

const FormatCategory: ClientComponent<FormatCategoryProps> = ({
  name,
  disabled,
}) => {
  const t = useTranslations("config.formats");
  const searchParams = useSearchParams();
  const wholeCategoryFormat = getWholeCategoryFormat(name);
  const selectedFormats = searchParams.getFormats();

  const isFormatFromCategorySelected = isFormatSelected(
    wholeCategoryFormat,
    selectedFormats
  );

  return (
    <FormControl component="fieldset" variant="standard" disabled={disabled}>
      <Format
        label={t(`${name}.category`)}
        value={wholeCategoryFormat}
        indeterminate={
          isFormatFromCategorySelected &&
          !isWholeCategorySelected(selectedFormats, name)
        }
      />
      <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
        {Object.entries(formats[name]).map(([formatName, formatValue]) => (
          <Format
            key={formatName}
            label={t(`${name}.${formatName}`)}
            value={formatValue}
          />
        ))}
      </Box>
    </FormControl>
  );
};

export default FormatPicker;
