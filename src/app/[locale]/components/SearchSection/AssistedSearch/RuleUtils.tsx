import {
  type AutocompleteRenderInputParams,
  ListItem,
  type SxProps,
  TextField,
  type TextFieldProps,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type * as React from "react";
import DelayedCircularProgress from "@/components/DelayedCircularProgress";
import {
  booleanComparators,
  type Comparator,
  languageComparators,
  numberComparators,
  textComparators,
} from "@/lib/ast";
import type { Field, FieldName } from "@/lib/fields";
import { unique } from "@/lib/utils";
import { inter } from "@/mui/fonts";

export const fontFamilyStyle: SxProps = {
  ".MuiInputBase-input": {
    fontFamily: inter.style.fontFamily,
  },
};

type AutocompleteInputProps = TextFieldProps &
  AutocompleteRenderInputParams & {
    isLoading?: boolean;
  };

export function AutocompleteInput(props: AutocompleteInputProps) {
  const { isLoading = false, slotProps, ...rest } = props;

  return (
    <TextField
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps.input,
          endAdornment: (
            <>
              {isLoading && (
                <DelayedCircularProgress color="inherit" size={20} />
              )}
              {slotProps.input.endAdornment}
            </>
          ),
        },
      }}
      sx={fontFamilyStyle}
      {...rest}
    />
  );
}

export function AutocompleteOption(
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
    <ListItem
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
    </ListItem>
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
