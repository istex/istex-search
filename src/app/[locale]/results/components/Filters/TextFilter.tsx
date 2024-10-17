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
import type { Field } from "./fields";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { getDefaultOperatorNode, type Node } from "@/lib/ast";
import { useApplyFilters, useSearchParams } from "@/lib/hooks";
import type { Aggregation } from "@/lib/istexApi";
import { areSetsEqual, labelizeIsoLanguage } from "@/lib/utils";

interface TextFilterProps {
  field: Field;
}

type SortField = "key" | "docCount";
type SortOrder = "asc" | "desc";

export default function TextFilter({ field }: TextFilterProps) {
  const t = useTranslations("results.Filters.TextFilter");
  const tFilters = useTranslations("results.Filters");
  const applyFilters = useApplyFilters();
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const { results } = useDocumentContext();
  const aggregation = results?.aggregations[field.name].buckets;
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

  if (aggregation == null) {
    return null;
  }

  const filteredValues = filterValues(aggregation, searchTerm);
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
        nodes: Array.from(
          selectedValues.values().map((value) => ({
            id: Math.random(),
            nodeType: "node",
            field: field.name,
            fieldType: "text",
            value,
            comparator:
              field.type === "language" || field.type === "text"
                ? "equals"
                : "contains",
          })),
        ),
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
            direction="up"
            onClick={() => {
              setSortField("key");
              setSortOrder("asc");
            }}
          />
          <SortButton
            direction="down"
            onClick={() => {
              setSortField("key");
              setSortOrder("desc");
            }}
          />
        </Stack>
        <Stack direction="row">
          <SortButton
            direction="up"
            onClick={() => {
              setSortField("docCount");
              setSortOrder("asc");
            }}
          />
          <SortButton
            direction="down"
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
  direction: "up" | "down";
}

function SortButton(props: SortButtonProps) {
  const { direction, ...rest } = props;
  const t = useTranslations("results.Filters.TextFilter");
  const label = direction === "up" ? t("sortDesc") : t("sortAsc");

  return (
    <IconButton
      title={label}
      aria-label={label}
      size="small"
      disableRipple
      color="inherit"
      sx={{
        p: 0.3125,
        "& .MuiSvgIcon-root": {
          fontSize: "0.625rem",
        },
      }}
      {...rest}
    >
      {direction === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </IconButton>
  );
}

interface ChecklistItemProps extends TextFilterProps {
  aggregation: Aggregation[string]["buckets"][number];
  checked: boolean;
  setValue: (value: string, checked: boolean) => void;
}

function ChecklistItem({
  field,
  aggregation,
  checked,
  setValue,
}: ChecklistItemProps) {
  const tLanguages = useTranslations("languages");
  const tResults = useTranslations("results");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const isImportSearchMode = searchParams.getSearchMode() === "import";
  const key = aggregation.key.toString();
  const label =
    field.type === "language"
      ? labelizeIsoLanguage(locale, key, tLanguages)
      : key;

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
      title={isImportSearchMode ? tResults("unavailableTitle") : undefined}
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

function filterValues(
  values: Aggregation[string]["buckets"],
  searchTerm: string,
) {
  const term = searchTerm.toLowerCase();

  return values.filter(({ key }) =>
    key.toString().toLowerCase().includes(term),
  );
}

function sortValues(
  values: Aggregation[string]["buckets"],
  sortField: SortField,
  sortOrder: SortOrder,
) {
  return values.sort((a, b) => {
    if (sortField === "key") {
      if (sortOrder === "asc") {
        return a[sortField].toString().localeCompare(b[sortField].toString());
      } else {
        return b[sortField].toString().localeCompare(a[sortField].toString());
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
