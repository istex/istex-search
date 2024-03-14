"use client";

import type { ChangeEventHandler } from "react";
import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { useTheme, type Theme } from "@mui/material/styles";
import {
  DEFAULT_OPERATOR,
  operators,
  type Node,
  type OperatorNode,
  type Operator as OperatorType,
} from "@/lib/assistedSearch/ast";
import type { ClientComponent } from "@/types/next";

interface OperatorProps {
  node: OperatorNode;
  setNode: (node: OperatorNode) => void;
  previousNode: Node;
  nextNode: Node;
  first: boolean;
  last: boolean;
}

const Operator: ClientComponent<OperatorProps> = ({
  node,
  setNode,
  previousNode,
  nextNode,
  first,
  last,
}) => {
  const theme = useTheme();
  const gap = spacing(1, theme);
  const currentNodeHeight = getNodeHeight(node, theme);
  const previousNodeHeight = getNodeHeight(previousNode, theme);
  const nextNodeHeight = getNodeHeight(nextNode, theme);
  const lineBoxHeight = previousNodeHeight / 2 + gap + nextNodeHeight / 2;
  const lineBoxMarginTop =
    currentNodeHeight / 2 + gap / 2 + previousNodeHeight / 2;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
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
        sx={{
          backgroundColor: "white",
          "& .MuiOutlinedInput-notchedOutline": {
            border: `1px solid ${theme.palette.primary.light}`,
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
          border: `1px solid ${theme.palette.primary.light}`,
          borderRight: "none",
          borderBottom: last
            ? `1px solid ${theme.palette.primary.light}`
            : "none",
          borderTopLeftRadius: first ? 10 : 0,
          borderBottomLeftRadius: last ? 10 : 0,
        }}
      />
    </Box>
  );
};

function spacing(multiplier: number, theme: Theme) {
  // This returns `${scalingFactor * multiplier}px` so we need to remove the
  // last 2 characters to get the number
  const spacingAsString = theme.spacing(multiplier).slice(0, -2);

  const spacingAsNumber = Number(spacingAsString);
  if (Number.isNaN(spacingAsNumber)) {
    throw new Error("theme.spacing returned an unexpected value");
  }

  return spacingAsNumber;
}

function getNodeHeight(node: Node, theme: Theme) {
  // This implementation is very fragile because most values are hard-coded.
  // A more proper way to calculate a node's height would be to use something
  // like useLayoutEffect with useRef but it'd be more complex to implement
  // and would most likely hurt performance.
  const buttonsHeight = 36.5;
  const padding = spacing(0.5, theme);
  const gap = spacing(1, theme);
  const ruleHeight = 50;
  const operatorHeight = 40;

  if (node.nodeType === "group") {
    // The buttons
    let groupHeight = buttonsHeight;

    // All the rules
    const ruleNodes = node.nodes.filter(
      (currentNode) => currentNode.nodeType !== "operator",
    );
    for (const currentNode of ruleNodes) {
      groupHeight += getNodeHeight(currentNode, theme);
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

export default Operator;
