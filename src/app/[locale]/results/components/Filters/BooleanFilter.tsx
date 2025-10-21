import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import ClearIcon from "@mui/icons-material/Clear";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ErrorUi from "./ErrorUi";
import Button from "@/components/Button";
import { getDefaultOperatorNode, type Node } from "@/lib/ast";
import type { Field } from "@/lib/fields";
import {
  useAggregationQuery,
  useApplyFilters,
  useSearchParams,
} from "@/lib/hooks";
import type { Aggregation } from "@/lib/istexApi";
import { visuallyHidden } from "@/lib/utils";

export interface BooleanFilterProps {
  field: Field & { type: "boolean" };
}

const VALUES = ["true", "false"] as const;

export default function BooleanFilter({ field }: BooleanFilterProps) {
  const tFields = useTranslations("fields");
  const tResults = useTranslations("results");
  const tFilters = useTranslations("results.Filters");
  const applyFilters = useApplyFilters();
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const isImportSearchMode = searchParams.getSearchMode() === "import";
  const aggregationQuery = useAggregationQuery(field);
  const activeFilter = filters.find((node) => isMatchingNode(node, field));
  const initialValue =
    activeFilter?.nodeType === "node" && activeFilter.fieldType === "boolean"
      ? activeFilter.value.toString()
      : null;
  const [value, setValue] = React.useState(initialValue);
  const hasPendingModifications = value !== initialValue;

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

  const handleValueChange = (_: React.SyntheticEvent, value: string) => {
    setValue(value);
  };

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    const newFilters = getClearedFilters();
    newFilters.push(getDefaultOperatorNode(), {
      id: Math.random(),
      nodeType: "node",
      field: field.name,
      fieldType: field.type,
      value: value === "true",
      comparator: "equals",
    });

    applyFilters(newFilters);
  };

  const handleClear: React.MouseEventHandler<HTMLButtonElement> = () => {
    const newFilters = getClearedFilters();

    applyFilters(newFilters);
  };

  if (aggregationQuery.isError) {
    return <ErrorUi error={aggregationQuery.error} />;
  }

  if (aggregationQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Stack
      component="form"
      autoComplete="off"
      spacing={1}
      onSubmit={handleSubmit}
    >
      <FormControl
        disabled={isImportSearchMode}
        title={isImportSearchMode ? tResults("unavailableTitle") : undefined}
      >
        <FormLabel id={`${field.name}-group-label`} sx={visuallyHidden}>
          {tFields(`${field.name}.description`)}
        </FormLabel>
        <RadioGroup
          aria-labelledby={`${field.name}-group-label`}
          name={`${field.name}-group`}
          value={value}
          onChange={handleValueChange}
        >
          {VALUES.map((v) => (
            <RadioGroupItem
              key={v}
              field={field}
              aggregation={aggregationQuery.data?.find(
                ({ keyAsString }) => keyAsString === v,
              )}
              value={v}
              checked={v === value}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Stack direction="row" spacing={1}>
        <Button
          type="submit"
          variant="outlined"
          fullWidth
          disabled={!hasPendingModifications}
        >
          {tFilters("apply")}
        </Button>
        <Button
          aria-label={tFilters("clear")}
          title={tFilters("clear")}
          variant="outlined"
          mainColor="grey"
          disabled={activeFilter == null}
          onClick={handleClear}
          sx={{ minWidth: "unset", p: 0.75 }}
        >
          <ClearIcon />
        </Button>
      </Stack>
    </Stack>
  );
}

interface RadioGroupItemProps extends BooleanFilterProps {
  aggregation?: Aggregation[string]["buckets"][number];
  value: string;
  checked: boolean;
}

function RadioGroupItem({
  field,
  aggregation,
  value,
  checked,
}: RadioGroupItemProps) {
  const t = useTranslations(`fields.${field.name}`);
  const locale = useLocale();
  const docCount = aggregation?.docCount ?? 0;

  return (
    <FormControlLabel
      key={value}
      value={value}
      control={<Radio size="small" />}
      checked={checked}
      label={
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            fontWeight: checked ? "bold" : undefined,
            color: checked ? "primary.main" : undefined,
          }}
        >
          <Typography
            component="span"
            variant="body2"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              mr: 1,
              fontWeight: "inherit",
            }}
          >
            {field.requiresLabeling === true ? t(value) : value}
          </Typography>
          <Typography
            component="span"
            variant="body2"
            sx={{ fontWeight: "inherit" }}
          >
            {docCount.toLocaleString(locale)}
          </Typography>
        </Stack>
      }
      slotProps={{
        typography: {
          sx: { flexGrow: 1 },
        },
      }}
    />
  );
}

function isMatchingNode(node: Node, field: Field) {
  return (
    node.nodeType === "node" &&
    node.fieldType === "boolean" &&
    node.field === field.name
  );
}

function LoadingSkeleton() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rounded" />
      <Skeleton variant="rounded" />

      {/* Buttons */}
      <Stack direction="row" spacing={1}>
        <Skeleton variant="rounded" height="2.25rem" sx={{ flexGrow: 1 }} />
        <Skeleton variant="rounded" width="2.25rem" height="2.25rem" />
      </Stack>
    </Stack>
  );
}
