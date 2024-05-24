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
import DelayedCircularProgress from "@/components/DelayedCircularProgress";
import {
  textComparators,
  numberComparators,
  booleanComparators,
  type FieldType,
  type Comparator,
  type FieldName,
} from "@/lib/assistedSearch/ast";
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
        color="text.secondary"
        sx={{
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

export function getComparators(
  fieldType: FieldType | null,
): readonly Comparator[] {
  switch (fieldType) {
    case "text":
      return textComparators;
    case "number":
      return numberComparators;
    case "boolean":
      return booleanComparators;
    default:
      return unique([
        ...textComparators,
        ...numberComparators,
        ...booleanComparators,
      ]);
  }
}
