import { Box, FormControl, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import type * as React from "react";
import Checkbox from "@/components/Checkbox";
import { DEFAULT_USAGE_NAME, type FormatCategoryName, formats } from "@/config";
import {
  deselectFormat,
  getWholeCategoryFormat,
  isFormatSelected,
  isWholeCategorySelected,
  selectFormat,
} from "@/lib/formats";
import { useSelectedFormats, useUsageName } from "@/lib/searchParams";

export default function FormatPicker() {
  const theme = useTheme();
  const onSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container spacing={1}>
      <Grid
        size={{
          xs: 6,
          sm: 4,
        }}
      >
        <FormatCategory name="fulltext" />
      </Grid>
      <Grid
        container
        size={{
          xs: 6,
          sm: 4,
        }}
      >
        <Grid
          size={{
            sm: 12,
          }}
        >
          <FormatCategory name="metadata" />
        </Grid>

        {!onSmallScreen &&
          Object.keys(formats.others).map((category) => (
            <Grid key={category} size={12}>
              <Format
                name={`others.${category}`}
                value={formats.others[category as keyof typeof formats.others]}
              />
            </Grid>
          ))}
      </Grid>

      <Grid
        size={{
          xs: 6,
          sm: 4,
        }}
      >
        <FormatCategory name="enrichments" />
      </Grid>

      {onSmallScreen && (
        <Grid container size={6} sx={{ alignContent: "start" }}>
          {Object.keys(formats.others).map((category) => (
            <Grid key={category} size={12}>
              <Format
                name={`others.${category}`}
                value={formats.others[category as keyof typeof formats.others]}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
}

interface FormatProps {
  name: string;
  value: number;
  indeterminate?: boolean;
}

function Format({ name, value, indeterminate }: FormatProps) {
  const t = useTranslations("config.formats");
  const [selectedFormats, setSelectedFormats] = useSelectedFormats();
  const [usageName] = useUsageName();
  const customUsageNotSelected = usageName !== DEFAULT_USAGE_NAME;

  const handleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    const newFormats = checked
      ? selectFormat(selectedFormats, value)
      : deselectFormat(selectedFormats, value);

    setSelectedFormats(newFormats);
  };

  return (
    <Checkbox
      name={name}
      label={t(name)}
      indeterminate={indeterminate}
      disabled={customUsageNotSelected}
      checked={isFormatSelected(selectedFormats, value)}
      onChange={handleChange}
    />
  );
}

interface FormatCategoryProps {
  name: FormatCategoryName;
}

function FormatCategory({ name }: FormatCategoryProps) {
  const wholeCategoryFormat = getWholeCategoryFormat(name);
  const [selectedFormats] = useSelectedFormats();
  const [usageName] = useUsageName();
  const customUsageNotSelected = usageName !== DEFAULT_USAGE_NAME;

  const isFormatFromCategorySelected = isFormatSelected(
    wholeCategoryFormat,
    selectedFormats,
  );

  return (
    <FormControl component="fieldset" disabled={customUsageNotSelected}>
      <Format
        name={`${name}.category`}
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
            name={`${name}.${formatName}`}
            value={formatValue}
          />
        ))}
      </Box>
    </FormControl>
  );
}
