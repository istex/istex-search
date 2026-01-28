import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useVirtualizer } from "@tanstack/react-virtual";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  IconButton,
  InputAdornment,
  InputBase,
  Skeleton,
  Stack,
  type IconButtonProps,
} from "@mui/material";
import ArrowDownIcon from "./ArrowDownIcon";
import ArrowUpIcon from "./ArrowUpIcon";
import ErrorUi from "./ErrorUi";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { getDefaultOperatorNode, type Node } from "@/lib/ast";
import type { Field } from "@/lib/fields";
import {
  useAggregationQuery,
  useApplyFilters,
  useSearchParams,
} from "@/lib/hooks";
import type { Aggregation } from "@/lib/istexApi";
import { areSetsEqual, labelizeIsoLanguage } from "@/lib/utils";

export interface TextFilterProps {
  field: Field & { type: "text" | "language" };
}

type SortField = "key" | "docCount";
type SortOrder = "asc" | "desc";

type AggregationBucket = Aggregation[string]["buckets"][number];
type LabelizedAggregation = AggregationBucket & {
  label?: string;
};

export default function TextFilter({ field }: TextFilterProps) {
  const t = useTranslations("results.Filters.TextFilter");
  const tFilters = useTranslations("results.Filters");
  const tFields = useTranslations("fields");
  const tLanguages = useTranslations("languages");
  const locale = useLocale();
  const applyFilters = useApplyFilters();
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const aggregationQuery = useAggregationQuery(field);
  const [searchTerm, setSearchTerm] = React.useState("");
  const searchTermLowercase = searchTerm.toLowerCase();
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

  const labelizeValue = React.useCallback(
    (value: AggregationBucket): LabelizedAggregation => {
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
    },
    [field, locale, tFields, tLanguages],
  );

  const filterValues = React.useCallback(
    ({ key, label }: LabelizedAggregation) => {
      // Filter on the label if it exists, on the key otherwise
      return (label ?? key.toString())
        .toLowerCase()
        .includes(searchTermLowercase);
    },
    [searchTermLowercase],
  );

  const sortValues = React.useCallback(
    (a: LabelizedAggregation, b: LabelizedAggregation) => {
      if (sortField === "key") {
        const firstValue = a.label ?? a[sortField].toString();
        const secondValue = b.label ?? b[sortField].toString();

        return sortOrder === "asc"
          ? firstValue.localeCompare(secondValue, [locale])
          : secondValue.localeCompare(firstValue, [locale]);
      } else {
        const firstValue = a[sortField];
        const secondValue = b[sortField];

        return sortOrder === "asc"
          ? firstValue - secondValue
          : secondValue - firstValue;
      }
    },
    [sortField, sortOrder, locale],
  );

  const sortedValues = React.useMemo(
    () =>
      (aggregationQuery.data ?? [])
        .map(labelizeValue)
        .filter(filterValues)
        .sort(sortValues),
    [aggregationQuery.data, labelizeValue, filterValues, sortValues],
  );

  const valueListRef = React.useRef(null);
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: sortedValues.length,
    getScrollElement: () => valueListRef.current,
    estimateSize: () => 28,
    initialRect: { width: 140, height: 28 },
    overscan: 3,
  });

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

  const handleSubmit: React.SubmitEventHandler = (event) => {
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

  if (aggregationQuery.isError) {
    return <ErrorUi error={aggregationQuery.error} />;
  }

  if (aggregationQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  // This is just to make TypeScript happy
  if (aggregationQuery.data == null) {
    throw new Error(
      `aggregationQuery.data is null for ${field.name}, this should not happen.`,
    );
  }

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
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            ({aggregationQuery.data.length.toLocaleString(locale)})
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
      <Box ref={valueListRef} sx={{ maxHeight: 140, overflow: "auto" }}>
        <Box
          sx={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const aggregation = sortedValues[virtualItem.index];
            const key = aggregation.key.toString();
            const checked = selectedValues.has(key);

            return (
              <Box
                key={virtualItem.key}
                sx={{
                  position: "absolute",
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <ChecklistItem
                  field={field}
                  aggregation={aggregation}
                  checked={checked}
                  setValue={setValue}
                />
              </Box>
            );
          })}
        </Box>
      </Box>

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
  aggregation: LabelizedAggregation;
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

function LoadingSkeleton() {
  return (
    <Stack spacing={1}>
      {/* Search input */}
      <Skeleton variant="rounded" sx={{ height: "2rem" }} />

      {/* Sort buttons */}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          color: "colors.darkBlack",
          px: 4,
        }}
      >
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Stack key={i} direction="row" spacing={1}>
              <Skeleton variant="rectangular" width={15} height={15} />
              <Skeleton variant="rectangular" width={15} height={15} />
            </Stack>
          ))}
      </Stack>

      {/* List of checkboxes */}
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} variant="rounded" />
        ))}

      {/* Buttons */}
      <Stack direction="row" spacing={1}>
        <Skeleton variant="rounded" height="2.25rem" sx={{ flexGrow: 1 }} />
        <Skeleton variant="rounded" width="2.25rem" height="2.25rem" />
      </Stack>
    </Stack>
  );
}
