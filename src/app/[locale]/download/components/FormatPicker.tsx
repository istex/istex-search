"use client";

import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
} from "@/mui/material";
import { type FormatCategoryName, formats, usages } from "@/config";
import {
  deselectFormat,
  getWholeCategoryFormat,
  isFormatSelected,
  selectFormat,
} from "@/lib/formats";
import type { ClientComponent } from "@/types/next";

const FormatPicker: ClientComponent = () => {
  const t = useTranslations("config.formats");
  const searchParams = useSearchParams();
  const [selectedFormats, setSelectedFormats] = useState(0);
  const currentUsage = searchParams.get("usage") ?? usages[0].name;
  const customUsageNotSelected = currentUsage !== usages[0].name;

  return (
    <Grid container spacing={2} sx={{ display: "flex" }}>
      <Grid item xs={4}>
        <FormatCategory
          name="fulltext"
          selectedFormats={selectedFormats}
          setSelectedFormats={setSelectedFormats}
          disabled={customUsageNotSelected}
        />
      </Grid>

      <Grid item xs={4} container>
        <Grid item xs={12}>
          <FormatCategory
            name="metadata"
            selectedFormats={selectedFormats}
            setSelectedFormats={setSelectedFormats}
            disabled={customUsageNotSelected}
          />
        </Grid>

        {Object.keys(formats.others).map((category) => (
          <Grid key={category} item xs={12}>
            <Format
              label={t(`others.${category}`)}
              value={formats.others[category as keyof typeof formats.others]}
              selectedFormats={selectedFormats}
              setSelectedFormats={setSelectedFormats}
              disabled={customUsageNotSelected}
            />
          </Grid>
        ))}
      </Grid>

      <Grid item xs={4}>
        <FormatCategory
          name="enrichments"
          selectedFormats={selectedFormats}
          setSelectedFormats={setSelectedFormats}
          disabled={customUsageNotSelected}
        />
      </Grid>
    </Grid>
  );
};

interface FormatProps {
  label: string;
  value: number;
  selectedFormats: number;
  setSelectedFormats: Dispatch<SetStateAction<number>>;
  indeterminate?: boolean;
  disabled?: boolean;
}

const Format: ClientComponent<FormatProps> = ({
  label,
  value,
  selectedFormats,
  setSelectedFormats,
  indeterminate,
  disabled,
}) => {
  const handleChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setSelectedFormats((prev) =>
      checked ? selectFormat(prev, value) : deselectFormat(prev, value)
    );
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
  selectedFormats: number;
  setSelectedFormats: Dispatch<SetStateAction<number>>;
  disabled?: boolean;
}

const FormatCategory: ClientComponent<FormatCategoryProps> = ({
  name,
  selectedFormats,
  setSelectedFormats,
  disabled,
}) => {
  const t = useTranslations("config.formats");
  const wholeCategoryFormat = getWholeCategoryFormat(name);

  const isFormatFromCategorySelected = isFormatSelected(
    wholeCategoryFormat,
    selectedFormats
  );

  const isWholeCategorySelected = isFormatSelected(
    selectedFormats,
    wholeCategoryFormat
  );

  return (
    <FormControl component="fieldset" variant="standard" disabled={disabled}>
      <Format
        label={t(`${name}.category`)}
        value={wholeCategoryFormat}
        indeterminate={isFormatFromCategorySelected && !isWholeCategorySelected}
        selectedFormats={selectedFormats}
        setSelectedFormats={setSelectedFormats}
      />
      <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
        {Object.entries(formats[name]).map(([formatName, formatValue]) => (
          <Format
            key={formatName}
            label={t(`${name}.${formatName}`)}
            value={formatValue}
            selectedFormats={selectedFormats}
            setSelectedFormats={setSelectedFormats}
          />
        ))}
      </Box>
    </FormControl>
  );
};

export default FormatPicker;
