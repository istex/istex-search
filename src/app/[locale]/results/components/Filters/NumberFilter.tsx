import * as React from "react";
import { useTranslations } from "next-intl";
import ClearIcon from "@mui/icons-material/Clear";
import { Stack, Typography } from "@mui/material";
import Button from "@/components/Button";
import NumberInput, { type NumberInputProps } from "@/components/NumberInput";
import Selector from "@/components/Selector";
import { useQueryContext } from "@/contexts/QueryContext";
import { getDefaultOperatorNode, type Node } from "@/lib/ast";
import type { Field } from "@/lib/fields";
import { useApplyFilters, useSearchParams } from "@/lib/hooks";

const INPUT_MODES = ["range", "value"] as const;
type InputMode = (typeof INPUT_MODES)[number];

interface NumberFilterProps {
  field: Field & { type: "number" };
}

export default function NumberFilter({ field }: NumberFilterProps) {
  const t = useTranslations("results.Filters.NumberFilter");
  const tResults = useTranslations("results");
  const tFilters = useTranslations("results.Filters");
  const applyFilters = useApplyFilters();
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const isImportSearchMode = searchParams.getSearchMode() === "import";
  const { isDate = false, hasDecimals = false } = field;
  const { results } = useQueryContext();
  const aggregation = results.aggregations[field.name].buckets[0];
  const initialMin = isDate
    ? Number(aggregation.fromAsString)
    : (aggregation.from ?? null);
  const initialMax = isDate
    ? Number(aggregation.toAsString)
    : (aggregation.to ?? null);
  const initialValue = initialMin === initialMax ? initialMin : null;
  const [min, setMin] = React.useState(initialMin);
  const [max, setMax] = React.useState(initialMax);
  const [value, setValue] = React.useState(initialValue);
  const [inputMode, setInputMode] = React.useState<InputMode>(
    initialValue != null ? "value" : "range",
  );
  const hasPendingModifications =
    inputMode === "range"
      ? min !== initialMin || max !== initialMax
      : value !== initialValue;
  const hasActiveFilters = filters.some((node) => isMatchingNode(node, field));
  const isValid =
    inputMode === "range" ? min != null && max != null : value != null;

  const getClearedFilters = () => {
    return filters.filter((node, index) => {
      const hasMatchingFieldName = isMatchingNode(node, field);
      const isOperator = node.nodeType === "operator";
      const nextNode = index < filters.length - 1 ? filters[index + 1] : null;
      const toKeep =
        hasMatchingFieldName ||
        (isOperator && nextNode != null && isMatchingNode(nextNode, field));

      return !toKeep;
    });
  };

  const handleInputModeChange = (_: React.SyntheticEvent, value: InputMode) => {
    setInputMode(value);
  };

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    const common = {
      id: Math.random(),
      nodeType: "node",
      field: field.name,
      fieldType: "number",
    } as const;

    // We start by removing the existing filters for the current field
    const newFilters = getClearedFilters();
    newFilters.push(getDefaultOperatorNode());

    if (inputMode === "range" && min != null && max != null) {
      newFilters.push({
        ...common,
        min,
        max,
        comparator: "between",
      });
    } else if (inputMode === "value" && value != null) {
      newFilters.push({
        ...common,
        value,
        comparator: "equals",
      });
    }

    applyFilters(newFilters);
  };

  const handleClear: React.MouseEventHandler<HTMLButtonElement> = () => {
    const newFilters = getClearedFilters();

    applyFilters(newFilters);
  };

  const commonNumberInputProps: NumberInputProps = {
    variant: "outlined",
    size: "small",
    color: "primary",
    disabled: isImportSearchMode,
    title: isImportSearchMode ? tResults("unavailableTitle") : undefined,
    hideActionButtons: true,
    step: hasDecimals ? 0.1 : undefined,
    numericFormatProps: isDate
      ? { decimalScale: 0, thousandSeparator: "" }
      : undefined,
  };

  return (
    <Stack
      component="form"
      autoComplete="off"
      spacing={1}
      onSubmit={handleSubmit}
    >
      {/* Input mode selector */}
      <Selector
        options={INPUT_MODES}
        disabled={isImportSearchMode}
        title={isImportSearchMode ? tResults("unavailableTitle") : undefined}
        value={inputMode}
        t={t}
        onChange={handleInputModeChange}
      />

      {/* Inputs */}
      {inputMode === "range" ? (
        <Stack
          direction="row"
          spacing={{ xs: 2, md: 1 }}
          sx={{
            alignItems: "center",
          }}
        >
          <NumberInput
            {...commonNumberInputProps}
            placeholder={t("minPlaceholder")}
            fullWidth
            value={min}
            onChange={setMin}
          />
          <Typography component="span" sx={{ verticalAlign: "middle" }}>
            {t("to")}
          </Typography>
          <NumberInput
            {...commonNumberInputProps}
            placeholder={t("maxPlaceholder")}
            fullWidth
            value={max}
            onChange={setMax}
          />
        </Stack>
      ) : (
        <NumberInput
          {...commonNumberInputProps}
          placeholder={t("valuePlaceholder")}
          value={value}
          onChange={setValue}
          sx={{ width: "50%" }}
        />
      )}

      {/* Buttons */}
      <Stack direction="row" spacing={1}>
        <Button
          type="submit"
          variant="outlined"
          fullWidth
          disabled={!hasPendingModifications || !isValid}
        >
          {tFilters("apply")}
        </Button>
        <Button
          aria-label={tFilters("clear")}
          title={tFilters("clear")}
          variant="outlined"
          mainColor="grey"
          disabled={!hasActiveFilters}
          onClick={handleClear}
          sx={{ minWidth: "unset", p: 0.75 }}
        >
          <ClearIcon />
        </Button>
      </Stack>
    </Stack>
  );
}

function isMatchingNode(node: Node, field: Field) {
  return (
    node.nodeType === "node" &&
    node.fieldType === "number" &&
    node.field === field.name
  );
}
