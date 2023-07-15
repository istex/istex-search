"use client";

import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
} from "@/mui/material";
import {
  type FormatCategoryName,
  formats,
  usages,
  NO_FORMAT_SELECTED,
} from "@/config";
import {
  deselectFormat,
  getWholeCategoryFormat,
  isFormatSelected,
  isWholeCategorySelected,
  selectFormat,
} from "@/lib/formats";
import type { ClientComponent } from "@/types/next";

const FormatPicker: ClientComponent = () => {
  const t = useTranslations("config.formats");
  const searchParams = useSearchParams();
  const currentUsage = searchParams.get("usage") ?? usages[0].name;
  const customUsageNotSelected = currentUsage !== usages[0].name;

  return (
    <Grid container spacing={2} sx={{ display: "flex" }}>
      <Grid item xs={4}>
        <FormatCategory name="fulltext" disabled={customUsageNotSelected} />
      </Grid>

      <Grid item xs={4} container>
        <Grid item xs={12}>
          <FormatCategory name="metadata" disabled={customUsageNotSelected} />
        </Grid>

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

      <Grid item xs={4}>
        <FormatCategory name="enrichments" disabled={customUsageNotSelected} />
      </Grid>
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

  // The Number constructor can return NaN but it's fine because NaN turns into
  // 0 when used with bitwise operators
  const selectedFormats = Number(searchParams.get("formats"));

  const handleChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const searchParamsCopy = new URLSearchParams(searchParams.toString());
    const newFormats = checked
      ? selectFormat(selectedFormats, value)
      : deselectFormat(selectedFormats, value);

    if (newFormats !== NO_FORMAT_SELECTED) {
      searchParamsCopy.set("formats", newFormats.toString());
    } else {
      searchParamsCopy.delete("formats");
    }

    router.push(`${pathname}?${searchParamsCopy.toString()}`);
  };

  return (
    <FormControlLabel
      key={label}
      label={label}
      disabled={disabled}
      componentsProps={{
        typography: {
          sx: (theme) => ({ fontSize: theme.typography.body2.fontSize }),
        },
      }}
      control={
        <Checkbox
          checked={isFormatSelected(selectedFormats, value)}
          indeterminate={indeterminate}
          onChange={handleChange}
        />
      }
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

  // The Number constructor can return NaN but it's fine because NaN turns into
  // 0 when used with bitwise operators
  const selectedFormats = Number(searchParams.get("formats"));

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
      <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
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
