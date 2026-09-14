"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  type AccordionProps,
  AccordionSummary,
  Stack,
  type SxProps,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import * as React from "react";
import Button from "@/components/Button";
import type { AST, Node } from "@/lib/ast";
import fields, { type Field } from "@/lib/fields";
import { useApplyFilters } from "@/lib/hooks";
import { useFilters } from "@/lib/searchParams";
import { splitArray } from "@/lib/utils";
import BooleanFilter, { type BooleanFilterProps } from "./BooleanFilter";
import NumberFilter, { type NumberFilterProps } from "./NumberFilter";
import TextFilter, { type TextFilterProps } from "./TextFilter";

const FILTER_FIELDS = splitArray(
  fields.filter((field) => field.inFilters === true),
  (field) => field.name.startsWith("categories."),
);

if (FILTER_FIELDS.length !== 3) {
  throw new Error("The fields should have been split into 3 groups.");
}

const SCIENTIFIC_CATEGORY_FIELDS = FILTER_FIELDS[1];

export default function Filters() {
  const t = useTranslations("results.Filters");
  const applyFilters = useApplyFilters();
  const [filters] = useFilters();

  // We need to expand the scientific category group if at least one of the
  // scientific category fields has an active filter
  const scientificCategoryGroupExpanded =
    filters.length > 0 &&
    SCIENTIFIC_CATEGORY_FIELDS.some((field) =>
      fieldHasActiveFilter(filters, field),
    );
  const [expanded, setExpanded] = React.useState(
    scientificCategoryGroupExpanded,
  );

  const handleChange: AccordionWrapperProps["onChange"] = (_, isExpanded) => {
    setExpanded(isExpanded);
  };

  const clearAll = () => {
    applyFilters([]);
  };

  return (
    <Stack
      spacing={1}
      sx={{
        width: { xs: undefined, md: "min-content" },
        height: "min-content",
        bgcolor: "common.white",
        borderRadius: 1,
        px: 1,
        pb: 1,
        "&&": {
          mb: 2,
        },
      }}
    >
      <Stack>
        {FILTER_FIELDS[0].map((field) => (
          <FilterAccordion key={field.name} field={field} />
        ))}
        <AccordionWrapper
          title={t("categoriesGroupHeader")}
          id="categories"
          expanded={expanded}
          onChange={handleChange}
        >
          {SCIENTIFIC_CATEGORY_FIELDS.map((field) => (
            <FilterAccordion
              key={field.name}
              field={field}
              sx={{ bgcolor: "white" }}
            />
          ))}
        </AccordionWrapper>
        {FILTER_FIELDS[2].map((field) => (
          <FilterAccordion key={field.name} field={field} />
        ))}
      </Stack>

      <Button
        startIcon={<DeleteIcon />}
        disabled={filters.length === 0}
        onClick={clearAll}
        sx={{ alignSelf: "center" }}
      >
        {t("clearAll")}
      </Button>
    </Stack>
  );
}

interface FilterAccordionProps {
  field: Field;
  children?: React.ReactNode;
  sx?: SxProps;
}

function FilterAccordion({ field, children, sx }: FilterAccordionProps) {
  const t = useTranslations("fields");
  const [filters] = useFilters();

  // When we have filters, only expend the accordions that have an active filter
  const defaultExpanded =
    filters.length > 0
      ? fieldHasActiveFilter(filters, field)
      : (field.defaultOpen ?? false);
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const handleChange: AccordionWrapperProps["onChange"] = (_, isExpanded) => {
    setExpanded(isExpanded);
  };

  return (
    <AccordionWrapper
      title={
        t.has(`${field.name}.filterTitle`)
          ? t(`${field.name}.filterTitle`)
          : t(`${field.name}.title`)
      }
      id={field.name}
      expanded={expanded}
      onChange={handleChange}
      sx={sx}
    >
      {children ?? renderFilterComponent(field)}
    </AccordionWrapper>
  );
}

interface AccordionWrapperProps {
  title: React.ReactNode;
  id: string;
  children: React.ReactNode;
  expanded?: AccordionProps["expanded"];
  onChange?: AccordionProps["onChange"];
  sx?: SxProps;
}

function AccordionWrapper({
  title,
  id,
  children,
  expanded,
  onChange,
  sx,
}: AccordionWrapperProps) {
  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      elevation={0}
      disableGutters
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={{ bgcolor: "common.white", ...sx }}
    >
      <AccordionSummary
        id={`${id}-header`}
        aria-controls={`${id}-content`}
        expandIcon={<ExpandMoreIcon />}
        sx={{
          textTransform: "uppercase",
          color: "primary.main",
          whiteSpace: "nowrap",
          overflow: "hidden",
          "& .MuiAccordionSummary-expandIconWrapper": {
            ml: 1,
            color: "primary.main",
          },
        }}
      >
        <Typography component="span" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: "white" }}>{children}</AccordionDetails>
    </Accordion>
  );
}

function renderFilterComponent(field: Field) {
  switch (field.type) {
    case "text":
    case "language":
      return <TextFilter field={field as TextFilterProps["field"]} />;
    case "number":
      return <NumberFilter field={field as NumberFilterProps["field"]} />;
    case "boolean":
      return <BooleanFilter field={field as BooleanFilterProps["field"]} />;
  }
}

function isMatchingNode(node: Node, field: Field) {
  return node.nodeType === "node" && field.name === node.field;
}

function isMatchingGroupNode(node: Node, field: Field) {
  return (
    node.nodeType === "group" &&
    node.nodes.some(
      (child) =>
        child.nodeType === "node" &&
        (child.fieldType === "text" || child.fieldType === "language") &&
        child.field === field.name,
    )
  );
}

function fieldHasActiveFilter(filters: AST, field: Field) {
  return filters.some(
    (node) => isMatchingNode(node, field) || isMatchingGroupNode(node, field),
  );
}
