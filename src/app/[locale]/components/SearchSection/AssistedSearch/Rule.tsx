"use client";

import { useState, type ChangeEventHandler, type SyntheticEvent } from "react";
import { useTranslations } from "next-intl";
import CancelIcon from "@mui/icons-material/Cancel";
import { Autocomplete, IconButton, Stack, TextField } from "@mui/material";
import {
  AutocompleteInput,
  FieldInputMenuItem,
  fontFamilyStyle,
  getComparators,
} from "./RuleUtils";
import {
  rangeComparators,
  type FieldType,
  type Comparator,
  type FieldName,
  type FieldNode,
  type AST,
} from "@/lib/assistedSearch/ast";
import { fields } from "@/lib/assistedSearch/fields";
import type { ClientComponent } from "@/types/next";

interface RuleProps {
  displayErrors: boolean;
  node: FieldNode;
  setNode: (newNode: FieldNode) => void;
  remove: () => void;
}

const FIELD_NAMES = fields.map(({ name }) => name);

const Rule: ClientComponent<RuleProps> = ({
  displayErrors,
  node,
  setNode,
  remove,
}) => {
  const t = useTranslations(
    "home.SearchSection.SearchInput.AssistedSearchInput",
  );
  const isNodePartial = node.partial === true;
  const isTextNode = node.fieldType === "text";
  const isNumberNode = node.fieldType === "number" && "value" in node;
  const isRangeNode = node.fieldType === "number" && "min" in node;
  const isBooleanNode = node.fieldType === "boolean";
  const [field, setField] = useState<FieldName | null>(
    !isNodePartial ? node.field : null,
  );
  const [fieldType, setFieldType] = useState<FieldType | null>(
    !isNodePartial ? node.fieldType : null,
  );
  const [comparator, setComparator] = useState<Comparator | null>(
    !isNodePartial ? node.comparator : null,
  );
  const [textValue, setTextValue] = useState(
    !isNodePartial && isTextNode ? node.value : "",
  );
  const [numberValue, setNumberValue] = useState(
    // The number value is stored as a string because that's what MUI excepts
    // MUI doesn't have any number input component just yet (https://mui.com/material-ui/react-text-field/#type-quot-number-quot)
    !isNodePartial && isNumberNode ? node.value.toString() : "",
  );
  const [minValue, setMinValue] = useState(
    !isNodePartial && isRangeNode ? node.min.toString() : "",
  );
  const [maxValue, setMaxValue] = useState(
    !isNodePartial && isRangeNode ? node.max.toString() : "",
  );
  const [booleanValue, setBooleanValue] = useState<boolean | null>(
    !isNodePartial && isBooleanNode ? node.value : null,
  );
  const hasValidValue =
    textValue !== "" || numberValue !== "" || booleanValue != null;

  const handleFieldChange = (_: SyntheticEvent, value: FieldName | null) => {
    setField(value);

    let partial = true;

    // When the field name is reset, reset the other inputs
    // because their values depend on the field name
    if (value == null) {
      setComparator(null);
      setFieldType(null);
      resetValue();
      setNode({ ...node, partial });
      return;
    }

    const newField = fields.find((field) => field.name === value);
    if (newField == null) {
      throw new Error(`Unexpected field name "${value}"`);
    }

    // If the currently selected comparator isn't supported
    // for the new field type, reset it
    const newComparators = getComparators(newField.type);
    if (comparator != null && !newComparators.includes(comparator)) {
      setComparator(null);
    }

    // Even if the field name is valid, the comparator and the value
    // also need to be valid for the node to be complete
    if (comparator != null && hasValidValue) {
      partial = false;
    }

    const implicitNodes = newField.implicitNodes as unknown as AST;

    setFieldType(newField.type);
    // @ts-expect-error TypeScript thinks fieldType is narrower than it actually is
    setNode({
      ...node,
      partial,
      fieldType: newField.type,
      field: value,
      implicitNodes: implicitNodes.length > 0 ? implicitNodes : undefined,
    });
  };

  const handleComparatorChange = (
    _: SyntheticEvent,
    value: Comparator | null,
  ) => {
    setComparator(value);

    let partial = true;

    if (value == null) {
      setNode({ ...node, partial });
      return;
    }

    // Even if the comparator is valid, the field name and the value
    // also need to be valid for the node to be complete
    if (field != null && hasValidValue) {
      partial = false;
    }

    // @ts-expect-error TypeScript thinks comparator is narrower than it actually is
    setNode({ ...node, comparator: value, partial });
  };

  const handleTextValueChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const { value } = event.target;
    setTextValue(value);

    const partial = value === "" || field == null || comparator == null;

    // @ts-expect-error TypeScript thinks fieldType is narrower than it actually is
    setNode({ ...node, value, partial });
  };

  const handleNumberValueChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const { value } = event.target;
    const valueAsNumber = Number(value);
    setNumberValue(value);

    let partial = true;

    if (value === "" || Number.isNaN(valueAsNumber)) {
      setNode({ ...node, partial });
      return;
    }

    // Even if the value is valid, the field name and the comparator
    // also need to be valid for the node to be complete
    partial = field == null || comparator == null;

    // @ts-expect-error TypeScript thinks fieldType is narrower than it actually is
    setNode({ ...node, value: valueAsNumber, partial });
  };

  const handleMinValueChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const { value: min } = event.target;
    const minAsNumber = Number(min);
    setMinValue(min);

    let partial = true;

    if (min === "" || Number.isNaN(minAsNumber)) {
      setNode({ ...node, partial });
      return;
    }

    // Even if the min is valid, the field name the comparator and
    // the max also need to be valid for the node to be complete
    partial = field == null || comparator == null || maxValue === "";

    if ("value" in node) {
      // @ts-expect-error value isn't optional but it breaks the query builder
      // if min and value are both defined
      delete node.value;
    }

    // @ts-expect-error TypeScript thinks fieldType is narrower than it actually is
    setNode({ ...node, min: minAsNumber, partial });
  };

  const handleMaxValueChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const { value: max } = event.target;
    const maxAsNumber = Number(max);
    setMaxValue(max);

    let partial = true;

    if (max === "" || Number.isNaN(maxAsNumber)) {
      setNode({ ...node, partial });
      return;
    }

    // Even if the max is valid, the field name the comparator and
    // the min also need to be valid for the node to be complete
    partial = field == null || comparator == null || minValue === "";

    if ("value" in node) {
      // @ts-expect-error value isn't optional but it breaks the query builder
      // if max and value are both defined
      delete node.value;
    }

    // @ts-expect-error TypeScript thinks fieldType is narrower than it actually is
    setNode({ ...node, max: maxAsNumber, partial });
  };

  const handleBooleanValueChange = (
    _: SyntheticEvent,
    value: boolean | null,
  ) => {
    setBooleanValue(value);

    let partial = true;

    if (value == null) {
      setNode({ ...node, partial });
      return;
    }

    // Even if the value is valid, the field name and the comparator
    // also need to be valid for the node to be complete
    partial = field == null || comparator == null;

    // @ts-expect-error TypeScript thinks fieldType is narrower than it actually is
    setNode({ ...node, value, partial });
  };

  const resetValue = () => {
    setTextValue("");
    setNumberValue("");
    setMinValue("");
    setMaxValue("");
    setBooleanValue(null);
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="space-between"
      className="rule"
      sx={(theme) => ({
        ml: 11,
        p: 0.5,
        border: `solid 1px ${theme.palette.primary.light}`,
        borderRadius: 1,
      })}
    >
      {/* Field */}
      <Autocomplete
        size="small"
        fullWidth
        options={FIELD_NAMES}
        value={field}
        onChange={handleFieldChange}
        getOptionLabel={(option) => t(`fields.${option}.title`)}
        renderInput={(params) => (
          <AutocompleteInput
            label={t("Dropdown.field")}
            placeholder={t("Dropdown.searchField")}
            error={displayErrors && field == null}
            {...params}
          />
        )}
        renderOption={(props, option) => {
          // @ts-expect-error "key" is not in HTMLAttributes<HTMLLIElement> but it is actually there at runtime
          const { key, ...rest } = props;

          return <FieldInputMenuItem key={key} option={option} {...rest} />;
        }}
      />

      {/* Comparator */}
      <Autocomplete
        size="small"
        fullWidth
        options={getComparators(fieldType)}
        value={comparator}
        onChange={handleComparatorChange}
        getOptionLabel={(option) => t(`Dropdown.${option}`)}
        renderInput={(params) => (
          <AutocompleteInput
            label={t("Dropdown.comparator")}
            placeholder={t("Dropdown.searchComparator")}
            error={displayErrors && comparator == null}
            {...params}
          />
        )}
      />

      {/* Value */}
      {(() => {
        if (fieldType === "number") {
          if (
            comparator != null &&
            (rangeComparators as readonly Comparator[]).includes(comparator)
          ) {
            // Range
            return (
              <Stack direction="row" spacing={2} width="100%">
                {/* Min */}
                <TextField
                  size="small"
                  type="number"
                  fullWidth
                  label={t("Dropdown.minValue")}
                  value={minValue}
                  onChange={handleMinValueChange}
                  error={displayErrors && minValue === ""}
                  sx={fontFamilyStyle}
                />

                {/* Max */}
                <TextField
                  size="small"
                  type="number"
                  fullWidth
                  label={t("Dropdown.maxValue")}
                  value={maxValue}
                  onChange={handleMaxValueChange}
                  error={displayErrors && maxValue === ""}
                  sx={fontFamilyStyle}
                />
              </Stack>
            );
          }

          // Number
          return (
            <TextField
              size="small"
              type="number"
              fullWidth
              label={t("Dropdown.value")}
              value={numberValue}
              onChange={handleNumberValueChange}
              error={displayErrors && numberValue === ""}
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
              getOptionLabel={(option) => t(`Dropdown.${option}`)}
              renderInput={(params) => (
                <AutocompleteInput
                  label={t("Dropdown.value")}
                  placeholder={t("Dropdown.searchValue")}
                  error={displayErrors && booleanValue == null}
                  {...params}
                />
              )}
            />
          );
        }

        // Text
        return (
          <TextField
            size="small"
            fullWidth
            label={t("Dropdown.value")}
            value={textValue}
            onChange={handleTextValueChange}
            error={displayErrors && textValue === ""}
            sx={fontFamilyStyle}
          />
        );
      })()}

      {/* Remove button */}
      <IconButton
        data-testid="remove-rule-button"
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
};

export default Rule;
