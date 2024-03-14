import { useState, type HTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import SearchIcon from "@mui/icons-material/Search";
import {
  InputAdornment,
  TextField,
  MenuItem,
  Typography,
  type TextFieldProps,
  type SxProps,
} from "@mui/material";
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
import type { ClientComponent } from "@/types/next";

export const fontFamilyStyle: SxProps = {
  ".MuiInputBase-input": {
    fontFamily: inter.style.fontFamily,
  },
};

export const AutocompleteInput: ClientComponent<TextFieldProps> = (props) => {
  const [focused, setFocused] = useState(false);
  const { InputProps, ...rest } = props;

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
            {focused && (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )}
            {InputProps?.endAdornment}
          </>
        ),
      }}
      sx={fontFamilyStyle}
      {...rest}
    />
  );
};

export const FieldInputMenuItem: ClientComponent<
  HTMLAttributes<HTMLLIElement> & { option: FieldName }
> = (props) => {
  const t = useTranslations(
    "home.SearchSection.SearchInput.AssistedSearchInput",
  );
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
};

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
