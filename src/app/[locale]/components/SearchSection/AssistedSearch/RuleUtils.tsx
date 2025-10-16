import * as React from "react";
import { useTranslations } from "next-intl";
import {
  MenuItem,
  TextField,
  Typography,
  type TextFieldProps,
  type SxProps,
} from "@mui/material";
import DelayedCircularProgress from "@/components/DelayedCircularProgress";
import {
  booleanComparators,
  languageComparators,
  numberComparators,
  textComparators,
  type Comparator,
} from "@/lib/ast";
import type { Field, FieldName } from "@/lib/fields";
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
  // NOTE: We still have to spread InputProps in slotProps.input because of a consistency problem about
  // the slotProps pattern in TextField described here https://github.com/mui/material-ui/issues/43573
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const { InputProps, isLoading = false, slotProps, ...rest } = props;

  return (
    <TextField
      slotProps={{
        ...slotProps,
        input: {
          // TODO: replace the next line with slotProps?.input once the slotProps pattern is standardized everywhere in MUI
          ...InputProps,
          endAdornment: (
            <>
              {isLoading && (
                <DelayedCircularProgress color="inherit" size={20} />
              )}
              {/* TODO: replace the next line with slotProps?.input?.endAdornment when it becomes available */}
              {InputProps?.endAdornment}
            </>
          ),
        },
      }}
      sx={fontFamilyStyle}
      {...rest}
    />
  );
}

export function FieldInputMenuItem(
  props: React.HTMLAttributes<HTMLLIElement> & { option: FieldName },
) {
  const t = useTranslations("fields");
  const { option, ...rest } = props;

  const labelizeFieldName = (fieldName: FieldName) => {
    return t.has(`${fieldName}.ruleTitle`)
      ? t(`${fieldName}.ruleTitle`)
      : t(`${fieldName}.title`);
  };

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
        {labelizeFieldName(option)}
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
          wordWrap: "break-word",
          whiteSpace: "normal",
          fontSize: "0.75rem",
        }}
      >
        {t(`${option}.description`)}
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
