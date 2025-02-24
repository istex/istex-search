import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import CancelIcon from "@mui/icons-material/Cancel";
import { Autocomplete, IconButton, Stack } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import {
  AutocompleteInput,
  FieldInputMenuItem,
  fontFamilyStyle,
  getComparators,
} from "./RuleUtils";
import NumberInput from "@/components/NumberInput";
import { rangeComparators, type Comparator, type FieldNode } from "@/lib/ast";
import fields, {
  fieldNames,
  type FieldName,
  type FieldType,
} from "@/lib/fields";
import { getPossibleValues } from "@/lib/istexApi";
import { labelizeIsoLanguage } from "@/lib/utils";

interface RuleProps {
  displayErrors: boolean;
  node: FieldNode;
  setNode: (newNode: FieldNode) => void;
  remove: () => void;
}

export default function Rule({
  displayErrors,
  node,
  setNode,
  remove,
}: RuleProps) {
  const t = useTranslations("home.SearchSection.AssistedSearchInput");
  const tFields = useTranslations("fields");
  const tLanguages = useTranslations("languages");
  const locale = useLocale();
  const isNodePartial = node.partial === true;
  const isTextNode = node.fieldType === "text" && "value" in node;
  const isLanguageNode = node.fieldType === "language" && "value" in node;
  const isNumberNode = node.fieldType === "number" && "value" in node;
  const isRangeNode = node.fieldType === "number" && "min" in node;
  const isBooleanNode = node.fieldType === "boolean" && "value" in node;
  const [fieldName, setFieldName] = React.useState<FieldName | null>(
    !isNodePartial ? node.field : null,
  );
  const [fieldType, setFieldType] = React.useState<FieldType | null>(
    !isNodePartial ? node.fieldType : null,
  );
  const [comparator, setComparator] = React.useState<Comparator | null>(
    !isNodePartial ? node.comparator : null,
  );
  const [textValue, setTextValue] = React.useState(
    !isNodePartial && (isTextNode || isLanguageNode) ? node.value : null,
  );
  const [numberValue, setNumberValue] = React.useState(
    !isNodePartial && isNumberNode ? node.value : null,
  );
  const [minValue, setMinValue] = React.useState(
    !isNodePartial && isRangeNode ? node.min : null,
  );
  const [maxValue, setMaxValue] = React.useState(
    !isNodePartial && isRangeNode ? node.max : null,
  );
  const [booleanValue, setBooleanValue] = React.useState<boolean | null>(
    !isNodePartial && isBooleanNode ? node.value : null,
  );
  const field = fields.find((field) => field.name === fieldName);
  const requiresFetchingValues = field?.requiresFetchingValues ?? false;
  const isDateField = field?.isDate === true;

  const valueQuery = useQuery({
    queryKey: ["rule-value", fieldName],
    // React Query won't call the function if fieldName is null because it controls the enabled property
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: async () => await getPossibleValues(fieldName!),
    enabled: requiresFetchingValues,
    retry: false,
  });

  const fieldNamesOrderedByTitle = React.useMemo(
    () =>
      fieldNames.toSorted((a, b) =>
        tFields(`${a}.title`).localeCompare(tFields(`${b}.title`)),
      ),
    [tFields],
  );

  // Custom search filter to search in the field title and description
  const fieldNameFilterOptions = React.useMemo(
    () =>
      createFilterOptions({
        stringify: (option: FieldName) =>
          tFields(`${option}.title`) + " " + tFields(`${option}.description`),
      }),
    [tFields],
  );

  const handleFieldNameChange = (
    _: React.SyntheticEvent,
    value: FieldName | null,
  ) => {
    setFieldName(value);

    // When the field name is changed, reset the other inputs because
    // their values depend on it
    setComparator(null);
    setFieldType(null);
    resetValue();

    const newNode = getNodeWithoutValue();

    if (value == null) {
      setNode(newNode);
      return;
    }

    const newField = fields.find((field) => field.name === value);
    if (newField == null) {
      throw new Error(`Unexpected field name "${value}"`);
    }

    const newComparators = getComparators(newField);

    // Auto set the comparator when only one is available
    const onlyOneComparatorAvailable = newComparators.length === 1;
    if (onlyOneComparatorAvailable) {
      setComparator(newComparators[0]);
    }

    setFieldType(newField.type);

    newNode.comparator = onlyOneComparatorAvailable
      ? newComparators[0]
      : newNode.comparator;
    newNode.fieldType = newField.type;
    newNode.field = value;
    newNode.implicitNodes = newField.implicitNodes;
    setNode(newNode);
  };

  const handleComparatorChange = (
    _: React.SyntheticEvent,
    value: Comparator | null,
  ) => {
    resetValue();
    const newNode = getNodeWithoutValue();

    setComparator(value);

    if (value == null) {
      setNode(newNode);
      return;
    }

    newNode.comparator = value;
    setNode(newNode);
  };

  const handleTextValueChange = (
    _: React.SyntheticEvent,
    value: string | null,
  ) => {
    const newNode = getNodeWithoutValue();

    setTextValue(value);

    // @ts-expect-error TypeScript thinks fieldType is narrower than it actually is
    newNode.value = value;
    newNode.partial =
      value == null || value === "" || fieldName == null || comparator == null;

    setNode(newNode);
  };

  const handleNumberValueChange = (value: number | null) => {
    const newNode = getNodeWithoutValue();

    setNumberValue(value);

    if (value == null || Number.isNaN(value)) {
      newNode.partial = true;
      setNode(newNode);
      return;
    }

    // @ts-expect-error TypeScript thinks fieldType is narrower than it actually is
    newNode.value = value;

    // Even if the value is valid, the field name and the comparator
    // also need to be valid for the node to be complete
    newNode.partial = fieldName == null || comparator == null;

    setNode(newNode);
  };

  const handleMinValueChange = (min: number | null) => {
    const newNode = getNodeWithoutValue(false);

    setMinValue(min);

    if (min == null || Number.isNaN(min)) {
      newNode.partial = true;
      setNode(newNode);
      return;
    }

    // @ts-expect-error TypeScript thinks fieldType is narrower than it actually is
    newNode.min = min;

    // Even if the min is valid, the field name the comparator and
    // the max also need to be valid for the node to be complete
    newNode.partial =
      fieldName == null || comparator == null || maxValue == null;

    setNode(newNode);
  };

  const handleMaxValueChange = (max: number | null) => {
    const newNode = getNodeWithoutValue(false);

    setMaxValue(max);

    if (max == null || Number.isNaN(max)) {
      newNode.partial = true;
      setNode(newNode);
      return;
    }

    // @ts-expect-error TypeScript thinks fieldType is narrower than it actually is
    newNode.max = max;

    // Even if the max is valid, the field name the comparator and
    // the min also need to be valid for the node to be complete
    newNode.partial =
      fieldName == null || comparator == null || minValue == null;

    setNode(newNode);
  };

  const handleBooleanValueChange = (
    _: React.SyntheticEvent,
    value: boolean | null,
  ) => {
    const newNode = getNodeWithoutValue();

    setBooleanValue(value);

    if (value == null) {
      newNode.partial = true;
      setNode(newNode);
      return;
    }

    // @ts-expect-error TypeScript thinks fieldType is narrower than it actually is
    newNode.value = value;

    // Even if the value is valid, the field name and the comparator
    // also need to be valid for the node to be complete
    newNode.partial = fieldName == null || comparator == null;

    setNode(newNode);
  };

  const resetValue = () => {
    setTextValue("");
    setNumberValue(null);
    setMinValue(null);
    setMaxValue(null);
    setBooleanValue(null);
  };

  const getNodeWithoutValue = (resetMinAndMax = true) => {
    const nodeWithoutValue = { ...node };

    // @ts-expect-error value isn't in the TypeScript type but it can be here at runtime
    delete nodeWithoutValue.value;

    if (resetMinAndMax) {
      // @ts-expect-error same as above but for min
      delete nodeWithoutValue.min;
      // @ts-expect-error same as above but for max
      delete nodeWithoutValue.max;
    }

    return nodeWithoutValue;
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      className="rule"
      sx={(theme) => ({
        justifyContent: "space-between",
        ml: 11,
        p: 0.75,
        border: `solid 1px ${theme.vars.palette.primary.light}`,
        borderRadius: 1,
      })}
    >
      {/* Field */}
      <Autocomplete
        size="small"
        fullWidth
        options={fieldNamesOrderedByTitle}
        value={fieldName}
        onChange={handleFieldNameChange}
        getOptionLabel={(option) => tFields(`${option}.title`)}
        filterOptions={fieldNameFilterOptions}
        slotProps={{
          listbox: {
            sx: {
              "& .MuiMenuItem-root": {
                whiteSpace: "wrap",
              },
            },
          },
        }}
        renderInput={(params) => (
          <AutocompleteInput
            label={t("field")}
            placeholder={t("searchField")}
            error={displayErrors && fieldName == null}
            {...params}
          />
        )}
        renderOption={(renderProps, option) => {
          const { key, ...rest } = renderProps;

          return <FieldInputMenuItem key={key} option={option} {...rest} />;
        }}
      />

      {/* Comparator */}
      <Autocomplete
        size="small"
        fullWidth
        options={getComparators(field ?? null)}
        value={comparator}
        onChange={handleComparatorChange}
        getOptionLabel={(option) => t(option)}
        renderInput={(params) => (
          <AutocompleteInput
            label={t("comparator")}
            placeholder={t("searchComparator")}
            error={displayErrors && comparator == null}
            {...params}
          />
        )}
      />

      {/* Value */}
      {(() => {
        if (fieldType === "number") {
          if (comparator != null && rangeComparators.includes(comparator)) {
            // Range
            return (
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  width: "100%",
                }}
              >
                {/* Min */}
                <NumberInput
                  size="small"
                  fullWidth
                  label={t("minValue")}
                  numericFormatProps={{
                    decimalScale: 0,
                    thousandSeparator: isDateField ? "" : undefined,
                  }}
                  value={minValue}
                  onChange={handleMinValueChange}
                  error={displayErrors && minValue == null}
                  sx={fontFamilyStyle}
                />

                {/* Max */}
                <NumberInput
                  size="small"
                  fullWidth
                  label={t("maxValue")}
                  numericFormatProps={{
                    decimalScale: 0,
                    thousandSeparator: isDateField ? "" : undefined,
                  }}
                  value={maxValue}
                  onChange={handleMaxValueChange}
                  error={displayErrors && maxValue == null}
                  sx={fontFamilyStyle}
                />
              </Stack>
            );
          }

          // Number
          return (
            <NumberInput
              size="small"
              fullWidth
              label={t("value")}
              numericFormatProps={{
                decimalScale: 0,
                thousandSeparator: isDateField ? "" : undefined,
              }}
              value={numberValue}
              onChange={handleNumberValueChange}
              error={displayErrors && numberValue == null}
              sx={fontFamilyStyle}
            />
          );
        }

        if (fieldType === "boolean") {
          // Boolean
          return (
            <Autocomplete
              size="small"
              fullWidth
              options={[true, false]}
              value={booleanValue}
              onChange={handleBooleanValueChange}
              getOptionLabel={(option) =>
                field?.requiresLabeling === true
                  ? tFields(`${fieldName}.${option}`)
                  : t(option.toString())
              }
              renderInput={(params) => (
                <AutocompleteInput
                  label={t("value")}
                  placeholder={t("searchValue")}
                  error={displayErrors && booleanValue == null}
                  {...params}
                />
              )}
            />
          );
        }

        // Text and language
        const freeSolo = comparator !== "equals" || !requiresFetchingValues;
        return (
          <Autocomplete
            size="small"
            fullWidth
            options={valueQuery.data ?? []}
            getOptionLabel={(option) =>
              fieldType === "language"
                ? labelizeIsoLanguage(locale, option, tLanguages)
                : field?.requiresLabeling === true && option !== ""
                  ? tFields(`${fieldName}.${option}`)
                  : option
            }
            freeSolo={freeSolo}
            value={textValue}
            onChange={handleTextValueChange}
            onBlur={
              // We use onBlur instead of onInputChange to avoid rerendering the whole form on each key press.
              // This is essentially the same behavior as autoSelect=true but without selecting the highlighted
              // option (cf. https://mui.com/material-ui/api/autocomplete/#autocomplete-prop-autoSelect)
              freeSolo
                ? (((event) => {
                    handleTextValueChange(event, event.target.value);
                  }) as React.FocusEventHandler<HTMLInputElement>)
                : undefined
            }
            loading={valueQuery.isLoading}
            renderInput={(params) => (
              <AutocompleteInput
                label={t("value")}
                placeholder={t("searchValue")}
                error={
                  (displayErrors && (textValue == null || textValue === "")) ||
                  valueQuery.isError ||
                  valueQuery.isLoadingError
                }
                isLoading={valueQuery.isLoading}
                {...params}
              />
            )}
          />
        );
      })()}

      {/* Remove button */}
      <IconButton
        data-testid="remove-rule-button"
        aria-label={t("removeRule")}
        title={t("removeRule")}
        onClick={remove}
        sx={{
          "&.MuiButtonBase-root": {
            ml: 0,
          },
        }}
      >
        <CancelIcon color="error" />
      </IconButton>
    </Stack>
  );
}
