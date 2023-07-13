"use client";

import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
} from "@/mui/material";
import { type FormatCategoryName, formats } from "@/config";
import {
  deselectFormat,
  getWholeCategoryFormat,
  isFormatSelected,
  selectFormat,
} from "@/lib/formats";
import type { ClientComponent } from "@/types/next";

const FormatPicker: ClientComponent = () => {
  const t = useTranslations("config.formats");
  const [selectedFormats, setSelectedFormats] = useState(0);

  return (
    <Grid
      container
      spacing={2}
      sx={(theme) => ({
        display: "flex",
        fontSize: theme.typography.body2.fontSize,
      })}
    >
      <Grid item xs={4}>
        <FormatCategory
          name="fulltext"
          selectedFormats={selectedFormats}
          setSelectedFormats={setSelectedFormats}
        />
      </Grid>

      <Grid item xs={4} container>
        <Grid item xs={12}>
          <FormatCategory
            name="metadata"
            selectedFormats={selectedFormats}
            setSelectedFormats={setSelectedFormats}
          />
        </Grid>

        {Object.keys(formats.others).map((category) => (
          <Grid key={category} item xs={12}>
            <Format
              label={t(`others.${category}`)}
              value={formats.others[category as keyof typeof formats.others]}
              selectedFormats={selectedFormats}
              setSelectedFormats={setSelectedFormats}
            />
          </Grid>
        ))}
      </Grid>

      <Grid item xs={4}>
        <FormatCategory
          name="enrichments"
          selectedFormats={selectedFormats}
          setSelectedFormats={setSelectedFormats}
        />
      </Grid>
    </Grid>
  );
};

interface FormatProps {
  label: string;
  value: number;
  indeterminate?: boolean;
  selectedFormats: number;
  setSelectedFormats: Dispatch<SetStateAction<number>>;
}

const Format: ClientComponent<FormatProps> = ({
  label,
  value,
  selectedFormats,
  indeterminate,
  setSelectedFormats,
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
      disableTypography
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
}

const FormatCategory: ClientComponent<FormatCategoryProps> = ({
  name,
  selectedFormats,
  setSelectedFormats,
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
    <FormControl component="fieldset" variant="standard">
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
