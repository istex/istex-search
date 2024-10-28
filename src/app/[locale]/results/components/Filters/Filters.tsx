"use client";

import { useLocale, useTranslations } from "next-intl";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from "@mui/material";
import BooleanFilter from "./BooleanFilter";
import NumberFilter from "./NumberFilter";
import TextFilter from "./TextFilter";
import Button from "@/components/Button";
import { useDocumentContext } from "@/contexts/DocumentContext";
import type { Node } from "@/lib/ast";
import fields, { type Field, type FieldType } from "@/lib/fields";
import { useApplyFilters, useSearchParams } from "@/lib/hooks";

const FIELDS = fields.filter((field) => field.inFilters);

export default function Filters() {
  const t = useTranslations("results.Filters");
  const tFields = useTranslations("fields");
  const locale = useLocale();
  const applyFilters = useApplyFilters();
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const { results } = useDocumentContext();

  const clearAll = () => {
    applyFilters([]);
  };

  return (
    <Stack
      spacing={1}
      sx={{
        bgcolor: "common.white",
        width: { xs: "100%", md: "55%" },
        borderRadius: 1,
        px: 1,
        pb: 1,
        "&&": {
          mb: 2,
        },
      }}
    >
      <Stack>
        {FIELDS.map((field) => {
          const Component = getComponent(field.type);

          // When we have filters, only expend the accordions that have an active filter
          const expanded =
            filters.length > 0
              ? filters.some(
                  (node) =>
                    isMatchingNode(node, field) ||
                    isMatchingGroupNode(node, field),
                )
              : field.defaultOpen;

          const count = results?.aggregations[field.name].buckets.length;

          return (
            <Accordion
              key={field.name}
              defaultExpanded={expanded}
              elevation={0}
              disableGutters
              slotProps={{ transition: { unmountOnExit: true } }}
              sx={{ bgcolor: "transparent" }}
            >
              <AccordionSummary
                id={`${field.name}-header`}
                aria-controls={`${field.name}-content`}
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  color: "primary.main",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  "& .MuiAccordionSummary-expandIconWrapper": {
                    ml: 1,
                    color: "primary.main",
                  },
                }}
              >
                {tFields(`${field.name}.title`)}

                {(field.type === "text" || field.type === "language") &&
                  count != null && <>&nbsp;({count.toLocaleString(locale)})</>}
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: "white" }}>
                {/* @ts-expect-error The type of the field prop became never here */}
                <Component field={field} />
              </AccordionDetails>
            </Accordion>
          );
        })}
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

function getComponent(fieldType: FieldType) {
  switch (fieldType) {
    case "text":
    case "language":
      return TextFilter;
    case "number":
      return NumberFilter;
    case "boolean":
      return BooleanFilter;
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
