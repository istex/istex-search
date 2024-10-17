import * as React from "react";
import { useTranslations } from "next-intl";
import SearchIcon from "@mui/icons-material/Search";
import {
  MenuItem,
  TextField,
  Typography,
  type TextFieldProps,
  type SxProps,
} from "@mui/material";
import type { Field } from "./fields";
import DelayedCircularProgress from "@/components/DelayedCircularProgress";
import {
  booleanComparators,
  languageComparators,
  numberComparators,
  textComparators,
  type Comparator,
  type FieldName,
} from "@/lib/ast";
import { unique } from "@/lib/utils";
import { inter } from "@/mui/fonts";

export const fontFamilyStyle: SxProps = {
  ".MuiInputBase-input": {
    fontFamily: inter.style.fontFamily,
  },
};

type AutocompleteInputProps = TextFieldProps & {
  isLoading?: boolean;
};

export function AutocompleteInput(props: AutocompleteInputProps) {
  // NOTE: We can't migrate from InputProps to slotProps.input just yet because of a bug in Autocomplete
  // described here https://github.com/mui/material-ui/issues/43573

  const [focused, setFocused] = React.useState(false);
  const { InputProps, isLoading, ...rest } = props;

  const getEndAdornment = () => {
    if (isLoading === true) {
      return <DelayedCircularProgress color="inherit" size={20} />;
    }

    if (focused) {
      return <SearchIcon />;
    }

    return null;
  };

  return (
    <TextField
      onFocus={(_) => {
        setFocused(true);
      }}
      onBlur={(_) => {
        setFocused(false);
      }}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <>
            {getEndAdornment()}
            {InputProps?.endAdornment}
          </>
        ),
      }}
      sx={fontFamilyStyle}
      {...rest}
    />
  );
}

export function FieldInputMenuItem(
  props: React.HTMLAttributes<HTMLLIElement> & { option: FieldName },
) {
  const t = useTranslations("home.SearchSection.AssistedSearchInput");
  const { option, ...rest } = props;

  return (
    <MenuItem
      sx={(theme) => ({
        display: "block !important",
        fontFamily: inter.style.fontFamily,
        py: `${theme.spacing(1)} !important`,
      })}
      {...rest}
    >
      <Typography
        sx={{
          fontSize: "0.875rem",
        }}
      >
        {t(`fields.${option}.title`)}
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
          wordWrap: "break-word",
          whiteSpace: "normal",
          fontSize: "0.75rem",
        }}
      >
        {t(`fields.${option}.description`)}
      </Typography>
    </MenuItem>
  );
}

export function getComparators(field: Field | null): readonly Comparator[] {
  // If the field has custom comparators, use them instead of the ones associated with the field type
  if (field?.comparators != null) {
    return field.comparators;
  }

  switch (field?.type) {
    case "text":
      return textComparators;
    case "number":
      return numberComparators;
    case "boolean":
      return booleanComparators;
    case "language":
      return languageComparators;
    default:
      return unique([
        ...textComparators,
        ...numberComparators,
        ...booleanComparators,
      ]);
  }
}
