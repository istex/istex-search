import * as React from "react";
import { useTranslations } from "next-intl";
import { Box, FormControl, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Checkbox from "@/components/Checkbox";
import { type FormatCategoryName, DEFAULT_USAGE_NAME, formats } from "@/config";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  deselectFormat,
  getWholeCategoryFormat,
  isFormatSelected,
  isWholeCategorySelected,
  selectFormat,
} from "@/lib/formats";
import { useSearchParams } from "@/lib/hooks";

export default function FormatPicker() {
  const theme = useTheme();
  const onSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container spacing={2}>
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const history = useHistoryContext();
  const selectedFormats = searchParams.getFormats();
  const currentUsageName = searchParams.getUsageName();
  const customUsageNotSelected = currentUsageName !== DEFAULT_USAGE_NAME;

  const handleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    const newFormats = checked
      ? selectFormat(selectedFormats, value)
      : deselectFormat(selectedFormats, value);

    searchParams.setFormats(newFormats);

    history.populateCurrentRequest({
      date: Date.now(),
      searchParams,
    });

    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
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
  const searchParams = useSearchParams();
  const wholeCategoryFormat = getWholeCategoryFormat(name);
  const selectedFormats = searchParams.getFormats();
  const currentUsageName = searchParams.getUsageName();
  const customUsageNotSelected = currentUsageName !== DEFAULT_USAGE_NAME;

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
