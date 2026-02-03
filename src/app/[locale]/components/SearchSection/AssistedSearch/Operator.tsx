import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import type * as React from "react";
import {
  DEFAULT_OPERATOR,
  type Node,
  type OperatorNode,
  type Operator as OperatorType,
  operators,
} from "@/lib/ast";

interface OperatorProps {
  node: OperatorNode;
  setNode: (node: OperatorNode) => void;
  previousNode: Node;
  nextNode: Node;
  first: boolean;
  last: boolean;
}

export default function Operator({
  node,
  setNode,
  previousNode,
  nextNode,
  first,
  last,
}: OperatorProps) {
  const t = useTranslations("home.SearchSection.AssistedSearchInput");
  const theme = useTheme();
  const gap = spacing(1);
  const currentNodeHeight = getNodeHeight(node);
  const previousNodeHeight = getNodeHeight(previousNode);
  const nextNodeHeight = getNodeHeight(nextNode);
  const lineBoxHeight = previousNodeHeight / 2 + gap + nextNodeHeight / 2;
  const lineBoxMarginTop =
    currentNodeHeight / 2 + gap / 2 + previousNodeHeight / 2;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setNode({ ...node, value: event.target.value as OperatorType });
  };

  return (
    <Box sx={{ position: "absolute", mt: -2 }}>
      <TextField
        select
        size="small"
        className="operator"
        value={node.value}
        onChange={handleChange}
        defaultValue={DEFAULT_OPERATOR}
        slotProps={{
          htmlInput: {
            "aria-label": t("operator"),
          },
        }}
        sx={{
          backgroundColor: "white",
          "& .MuiOutlinedInput-notchedOutline": {
            border: `1px solid ${theme.vars.palette.primary.light}`,
          },
          "& .MuiInputBase-root": {
            fontWeight: "bold",
            borderRadius: 10,
          },
        }}
      >
        {operators.map((operator) => (
          <MenuItem key={operator} value={operator}>
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: "unset",
              }}
            >
              {operator}
            </Typography>
          </MenuItem>
        ))}
      </TextField>
      <Box
        sx={{
          width: "50px",
          height: `${lineBoxHeight}px`,
          marginTop: `-${lineBoxMarginTop}px`,
          marginLeft: theme.spacing(4.75),
          border: `1px solid ${theme.vars.palette.primary.light}`,
          borderRight: "none",
          borderBottom: last
            ? `1px solid ${theme.vars.palette.primary.light}`
            : "none",
          borderTopLeftRadius: first ? 10 : 0,
          borderBottomLeftRadius: last ? 10 : 0,
        }}
      />
    </Box>
  );
}

function spacing(multiplier: number) {
  const spacingAsString = getComputedStyle(document.documentElement)
    .getPropertyValue("--mui-spacing")
    .slice(0, -2);

  const spacingAsNumber = Number(spacingAsString);
  if (Number.isNaN(spacingAsNumber)) {
    throw new Error("theme.spacing returned an unexpected value");
  }

  return spacingAsNumber * multiplier;
}

function getNodeHeight(node: Node) {
  // This implementation is very fragile because most values are hard-coded.
  // A more proper way to calculate a node's height would be to use something
  // like useLayoutEffect with useRef but it'd be more complex to implement
  // and would most likely hurt performance.
  const buttonsHeight = 36.5;
  const padding = spacing(0.5);
  const gap = spacing(1);
  const ruleHeight = 54;
  const operatorHeight = 40;

  if (node.nodeType === "group") {
    // The buttons
    let groupHeight = buttonsHeight;

    // All the rules
    const ruleNodes = node.nodes.filter(
      (currentNode) => currentNode.nodeType !== "operator",
    );
    for (const currentNode of ruleNodes) {
      groupHeight += getNodeHeight(currentNode);
    }

    // The gap between each rule
    groupHeight += gap * (ruleNodes.length - 1);

    // The final bottom padding
    groupHeight += padding;

    return groupHeight;
  }

  if (node.nodeType === "operator") {
    return operatorHeight;
  }

  return ruleHeight;
}
