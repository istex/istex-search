"use client";

import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";
import { Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { Node } from "@/lib/ast";
import fields, { type Field } from "@/lib/fields";
import { useApplyFilters, useSearchParams } from "@/lib/hooks";
import { labelizeIsoLanguage } from "@/lib/utils";

interface Tag {
  nodeId: number;
  groupId?: number;
  hasNot: boolean;
  field: Field;
  value: string;
}

export default function FilterTags() {
  const t = useTranslations("results.FilterTags");
  const tFields = useTranslations("fields");
  const tLanguages = useTranslations("languages");
  const locale = useLocale();
  const applyFilters = useApplyFilters();
  const searchParams = useSearchParams();
  const filters = searchParams.getFilters();
  const tags: Tag[] = filters
    .flatMap((node, index) => {
      // We don't want to render a tag for operators but we can't simply filter on the nodeType before
      // mapping because we still need to access them for rendering the "NOT"
      if (node.nodeType !== "node" && node.nodeType !== "group") {
        return null;
      }

      const nodeId = node.id;
      if (nodeId == null) {
        throw new Error("Unexpected node structure, an ID is required");
      }

      if (node.nodeType === "group") {
        return node.nodes
          .map((child, index) => {
            if (!isTextLikeNode(child)) {
              return null;
            }

            const childId = child.id;
            if (childId == null) {
              throw new Error(
                "Unexpected child node structure, an ID is required",
              );
            }

            const previousChild = index > 0 ? node.nodes[index - 1] : null;
            const field = fields.find(({ name }) => child.field === name);
            if (field == null) {
              throw new Error(
                "Unexpected child node structure, field must be a valid field name",
              );
            }

            return {
              nodeId: childId,
              groupId: nodeId,
              hasNot:
                previousChild?.nodeType === "operator" &&
                previousChild.value === "NOT",
              field,
              value: child.value,
            };
          })
          .filter(Boolean);
      }

      const previousNode = index > 0 ? filters[index - 1] : null;
      const field = fields.find(({ name }) => node.field === name);
      if (field == null) {
        throw new Error(
          "Unexpected child node structure, field must be a valid field name",
        );
      }

      const tag = {
        nodeId,
        hasNot:
          previousNode?.nodeType === "operator" && previousNode.value === "NOT",
        field,
      };

      if (node.comparator === "between") {
        return {
          ...tag,
          value: `${node.min}-${node.max}`,
        };
      }

      return {
        ...tag,
        value: node.value.toString(),
      };
    })
    .filter(Boolean);

  const handleDelete = (tag: Tag) => {
    const newFilters = [...filters];
    const isPartOfGroup = tag.groupId != null;

    if (isPartOfGroup) {
      // Find the group
      const groupIndex = newFilters.findIndex(
        (node) => node.id === tag.groupId,
      );
      const groupNode = groupIndex >= 0 ? newFilters[groupIndex] : null;
      if (groupNode?.nodeType !== "group") {
        throw new Error("tag.groupId should be the ID of a group");
      }

      // Find the node within the group
      const nodeIndex = groupNode.nodes.findIndex(
        (node) => node.id === tag.nodeId,
      );

      // Check if a NOT operator is before the node
      const previousNodeIndex = nodeIndex - 1;
      const previousNode =
        previousNodeIndex >= 0 ? groupNode.nodes[previousNodeIndex] : null;
      const hasNot =
        previousNode?.nodeType === "operator" && previousNode.value === "NOT";

      // Remove the node referenced by the tag to the list of child nodes
      // and the NOT operator if it exists
      if (hasNot) {
        groupNode.nodes.splice(previousNodeIndex, 2);
      } else {
        groupNode.nodes.splice(nodeIndex, 1);
      }

      // If the list of child nodes became empty, remove the whole group and its previous operator
      if (groupNode.nodes.length === 0) {
        newFilters.splice(groupIndex - 1, 2);
      }
    } else {
      // Remove the node referenced by the tag and its previous operator
      const nodeIndex = newFilters.findIndex((node) => node.id === tag.nodeId);
      if (nodeIndex < 1) {
        throw new Error(
          "Unexpected AST structure, node was not found or not preceded by an operator",
        );
      }

      newFilters.splice(nodeIndex - 1, 2);
    }

    applyFilters(newFilters);
  };

  const toggleNot = (tag: Tag) => {
    const newFilters = [...filters];
    const isPartOfGroup = tag.groupId != null;

    if (isPartOfGroup) {
      // Find the group
      const groupIndex = newFilters.findIndex(
        (node) => node.id === tag.groupId,
      );
      const groupNode = groupIndex >= 0 ? newFilters[groupIndex] : null;
      if (groupNode?.nodeType !== "group") {
        throw new Error("tag.groupId should be the ID of a group");
      }

      // Find the node within the group
      const nodeIndex = groupNode.nodes.findIndex(
        (node) => node.id === tag.nodeId,
      );

      // Check if a NOT operator is before the node
      const previousNodeIndex = nodeIndex - 1;
      const previousNode =
        previousNodeIndex >= 0 ? groupNode.nodes[previousNodeIndex] : null;
      const hasNot =
        previousNode?.nodeType === "operator" && previousNode.value === "NOT";

      if (hasNot) {
        // Delete the NOT operator
        groupNode.nodes.splice(previousNodeIndex, 1);
      } else {
        // Insert a NOT operator
        groupNode.nodes.splice(nodeIndex, 0, {
          id: Math.random(),
          nodeType: "operator",
          value: "NOT",
        });
      }
    } else {
      const nodeIndex = newFilters.findIndex((node) => node.id === tag.nodeId);

      // Check if a NOT operator is before the node
      const previousNodeIndex = nodeIndex - 1;
      const previousNode =
        previousNodeIndex >= 0 ? newFilters[previousNodeIndex] : null;
      if (previousNode?.nodeType !== "operator") {
        throw new Error(
          "Unexpected AST structure, a node should be preceded by an operator",
        );
      }

      // Swap the operator value between AND and NOT
      previousNode.value = previousNode.value === "AND" ? "NOT" : "AND";
    }

    applyFilters(newFilters);
  };

  if (filters.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1}>
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{
            color: "primary.main",
            fontSize: "0.6875rem",
          }}
        >
          {t("title")}
        </Typography>

        <Tooltip
          title={t("tooltip")}
          placement="right"
          arrow
          slotProps={{
            popper: {
              sx: {
                "& .MuiTooltip-tooltip": {
                  backgroundColor: "primary.main",
                },
                "& .MuiTooltip-arrow": {
                  color: "primary.main",
                },
              },
            },
          }}
        >
          <IconButton disableRipple size="small" color="primary">
            <HelpIcon
              sx={{
                fontSize: "0.8rem",
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
        {tags.map((tag) => {
          const label =
            tag.field.type === "language"
              ? labelizeIsoLanguage(locale, tag.value, tLanguages)
              : tag.field.requiresLabeling === true
                ? tFields(`${tag.field.name}.${tag.value}`)
                : tag.value;
          const fullLabel = tag.hasNot ? `NOT ${label}` : label;
          const ui = tag.hasNot ? (
            <>
              <Typography
                component="span"
                sx={{
                  fontSize: "inherit",
                  fontWeight: "bold",
                  color: "colors.red",
                  pr: 0.5,
                }}
              >
                NOT
              </Typography>
              {label}
            </>
          ) : (
            label
          );

          return (
            <Chip
              key={fullLabel}
              label={ui}
              title={tFields(`${tag.field.name}.title`)}
              size="small"
              deleteIcon={
                <CancelIcon titleAccess={t("clear", { value: fullLabel })} />
              }
              onClick={() => {
                toggleNot(tag);
              }}
              onDelete={() => {
                handleDelete(tag);
              }}
              sx={{
                borderRadius: 1,
                "& .MuiChip-label": {
                  fontSize: "0.75rem",
                },
              }}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}

function isTextLikeNode(node: Node) {
  return (
    node.nodeType === "node" &&
    (node.fieldType === "text" || node.fieldType === "language")
  );
}
