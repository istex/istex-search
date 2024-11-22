import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  IconButton,
  InputAdornment,
  InputBase,
  Stack,
  type IconButtonProps,
} from "@mui/material";
import ArrowDownIcon from "./ArrowDownIcon";
import ArrowUpIcon from "./ArrowUpIcon";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { useQueryContext } from "@/contexts/QueryContext";
import { getDefaultOperatorNode, type Node } from "@/lib/ast";
import type { Field } from "@/lib/fields";
import { useApplyFilters, useSearchParams } from "@/lib/hooks";
import type { Aggregation } from "@/lib/istexApi";
import { areSetsEqual, labelizeIsoLanguage } from "@/lib/utils";

interface TextFilterProps {
  field: Field & { type: "text" | "language" };
}

type SortField = "key" | "docCount";
type SortOrder = "asc" | "desc";

type LabelizedAggregation = (Aggregation[string]["buckets"][number] & {
  label?: string;
})[];

export default function TextFilter({ field }: TextFilterProps) {
  const t = useTranslations("results.Filters.TextFilter");
  const tFilters = useTranslations("results.Filters");
  const tFields = useTranslations("fields");
  const tLanguages = useTranslations("languages");
  const locale = useLocale();
  const applyFilters = useApplyFilters();
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const { results } = useQueryContext();
  const aggregation = results.aggregations[field.name].buckets;
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc");
  const [sortField, setSortField] = React.useState<SortField>("docCount");
  const initiallySelectedValues = new Set(
    filters
      .filter((node) => isMatchingGroupNode(node, field))
      // @ts-expect-error TypeScript isn't smart enough to know that node is of type GroupNode here
      .flatMap((node) => node.nodes as Node[])
      .filter((node) => isMatchingNode(node, field))
      // @ts-expect-error TypeScript isn't smart enough to know that node is of type TextNode | LanguageNode here
      .map((node) => node.value as string),
  );
  const [selectedValues, setSelectedValues] = React.useState(
    initiallySelectedValues,
  );
  const hasPendingModifications = !areSetsEqual(
    initiallySelectedValues,
    selectedValues,
  );

  const labelizedValues: LabelizedAggregation = aggregation.map((value) => {
    if (field.type === "language") {
      return {
        ...value,
        label: labelizeIsoLanguage(locale, value.key.toString(), tLanguages),
      };
    }

    if (field.requiresLabeling === true) {
      return { ...value, label: tFields(`${field.name}.${value.key}`) };
    }

    return value;
  });
  const filteredValues = filterValues(labelizedValues, searchTerm);
  const sortedValues = sortValues(filteredValues, sortField, sortOrder);

  const getClearedFilters = () => {
    return filters.filter((node, index) => {
      const hasMatchingFieldName = isMatchingGroupNode(node, field);
      const isOperator = node.nodeType === "operator";
      const nextNode = index < filters.length - 1 ? filters[index + 1] : null;
      const toKeep =
        hasMatchingFieldName ||
        (isOperator &&
          nextNode != null &&
          isMatchingGroupNode(nextNode, field));

      return !toKeep;
    });
  };

  const setValue = (value: string, checked: boolean) => {
    const newSelectedValues = new Set(selectedValues);

    if (checked) {
      newSelectedValues.add(value);
    } else {
      newSelectedValues.delete(value);
    }

    setSelectedValues(newSelectedValues);
  };

  const handleSearchTermChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    // We start by removing the existing filters for the current field
    const newFilters = getClearedFilters();

    if (selectedValues.size > 0) {
      newFilters.push(getDefaultOperatorNode(), {
        id: Math.random(),
        nodeType: "group",
        nodes: Array.from(selectedValues.values()).map((value) => ({
          id: Math.random(),
          nodeType: "node",
          field: field.name,
          fieldType: field.type,
          value,
          comparator: "equals",
        })),
      });
    }

    applyFilters(newFilters);
  };

  const handleClear: React.MouseEventHandler<HTMLButtonElement> = () => {
    const newFilters = getClearedFilters();

    applyFilters(newFilters);
  };

  return (
    <Stack
      component="form"
      autoComplete="off"
      spacing={1}
      onSubmit={handleSubmit}
    >
      {/* Search bar */}
      <InputBase
        id={`${field.name}-search-input`}
        fullWidth
        size="small"
        placeholder={t("search")}
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        value={searchTerm}
        onChange={handleSearchTermChange}
        sx={{
          fontSize: "0.8rem",
          backgroundColor: "common.white",
          borderRadius: 1,
          px: 2,
          py: 0.5,
          "& .MuiInputBase-input": {
            padding: 0,
          },
        }}
      />

      {/* Sort buttons */}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          color: "colors.darkBlack",
          px: 4,
        }}
      >
        <Stack direction="row">
          <SortButton
            sortOrder="asc"
            sortField="key"
            onClick={() => {
              setSortField("key");
              setSortOrder("asc");
            }}
          />
          <SortButton
            sortOrder="desc"
            sortField="key"
            onClick={() => {
              setSortField("key");
              setSortOrder("desc");
            }}
          />
        </Stack>
        <Stack direction="row">
          <SortButton
            sortOrder="asc"
            sortField="docCount"
            onClick={() => {
              setSortField("docCount");
              setSortOrder("asc");
            }}
          />
          <SortButton
            sortOrder="desc"
            sortField="docCount"
            onClick={() => {
              setSortField("docCount");
              setSortOrder("desc");
            }}
          />
        </Stack>
      </Stack>

      {/* Values */}
      <Stack sx={{ maxHeight: 140, overflow: "auto" }}>
        {sortedValues.map((aggregation) => {
          const key = aggregation.key.toString();
          const checked = selectedValues.has(key);

          return (
            <ChecklistItem
              key={key}
              field={field}
              aggregation={aggregation}
              checked={checked}
              setValue={setValue}
            />
          );
        })}
      </Stack>

      {/* Buttons */}
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
          disabled={initiallySelectedValues.size === 0}
          onClick={handleClear}
          sx={{ minWidth: "unset", p: 0.75 }}
        >
          <ClearIcon />
        </Button>
      </Stack>
    </Stack>
  );
}

interface SortButtonProps extends IconButtonProps {
  sortField: SortField;
  sortOrder: SortOrder;
}

function SortButton(props: SortButtonProps) {
  const { sortField, sortOrder, ...rest } = props;
  const t = useTranslations("results.Filters.TextFilter");
  const label = t(
    `sort${sortField === "key" ? "Key" : "DocCount"}${sortOrder === "asc" ? "Asc" : "Desc"}`,
  );

  return (
    <IconButton
      title={label}
      aria-label={label}
      size="small"
      color="inherit"
      sx={{
        p: 0.3125,
        "& .MuiSvgIcon-root": {
          fontSize: "0.625rem",
        },
      }}
      {...rest}
    >
      {sortOrder === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </IconButton>
  );
}

interface ChecklistItemProps extends TextFilterProps {
  aggregation: LabelizedAggregation[number];
  checked: boolean;
  setValue: (value: string, checked: boolean) => void;
}

function ChecklistItem({
  field,
  aggregation,
  checked,
  setValue,
}: ChecklistItemProps) {
  const tResults = useTranslations("results");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const isImportSearchMode = searchParams.getSearchMode() === "import";
  const key = aggregation.key.toString();
  const label = aggregation.label ?? key;

  return (
    <Checkbox
      name={`${field.name}-${key}`}
      label={
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            justifyContent: "space-between",
            fontWeight: checked ? "bold" : undefined,
            color: checked ? "primary.main" : undefined,
          }}
        >
          <Box
            component="span"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              mr: 1,
            }}
          >
            {label}
          </Box>
          <span>{aggregation.docCount.toLocaleString(locale)}</span>
        </Box>
      }
      disabled={isImportSearchMode}
      title={isImportSearchMode ? tResults("unavailableTitle") : label}
      checked={checked}
      onChange={(event) => {
        setValue(key, event.target.checked);
      }}
      sx={{
        "&.MuiCheckbox-root.MuiCheckbox-sizeSmall": {
          p: 0.5,
        },
      }}
    />
  );
}

function filterValues(values: LabelizedAggregation, searchTerm: string) {
  const term = searchTerm.toLowerCase();

  return values.filter(({ key, label }) =>
    // Filter on the label if it exists, on the key otherwise
    (label ?? key.toString()).toLowerCase().includes(term),
  );
}

function sortValues(
  values: LabelizedAggregation,
  sortField: SortField,
  sortOrder: SortOrder,
) {
  return values.sort((a, b) => {
    if (sortField === "key") {
      if (sortOrder === "asc") {
        // Sort based on the label if it exists, on the key otherwise
        return (a.label ?? a[sortField].toString()).localeCompare(
          b.label ?? b[sortField].toString(),
        );
      } else {
        // Same as above in reverse order
        return (b.label ?? b[sortField].toString()).localeCompare(
          a.label ?? a[sortField].toString(),
        );
      }
    } else {
      if (sortOrder === "asc") {
        return a[sortField] - b[sortField];
      } else {
        return b[sortField] - a[sortField];
      }
    }
  });
}

function isMatchingNode(node: Node, field: Field) {
  return (
    node.nodeType === "node" &&
    (node.fieldType === "text" || node.fieldType === "language") &&
    node.field === field.name
  );
}

function isMatchingGroupNode(node: Node, field: Field) {
  return (
    node.nodeType === "group" &&
    node.nodes.some((child) => isMatchingNode(child, field))
  );
}
