import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, Button as MuiButton, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  type FieldNode,
  getDefaultOperatorNode,
  getEmptyFieldNode,
  getEmptyGroupNode,
  type Node,
  type OperatorNode,
} from "@/lib/ast";
import Operator from "./Operator";
import Rule from "./Rule";

interface GroupProps {
  root?: boolean;
  displayErrors: boolean;
  childNodes: Node[];
  setChildNodes: (childNodes: Node[]) => void;
  remove: () => void;
}

export default function Group(props: GroupProps) {
  const {
    root = false,
    displayErrors,
    childNodes,
    setChildNodes,
    remove,
  } = props;
  const t = useTranslations("home.SearchSection.AssistedSearchInput");
  const firstOperator = childNodes.find(
    (child) => child.nodeType === "operator",
  );
  const lastOperator = childNodes.findLast(
    (child) => child.nodeType === "operator",
  );

  const addRule = () => {
    setChildNodes([
      ...childNodes,
      getDefaultOperatorNode(),
      getEmptyFieldNode(),
    ]);
  };

  const addGroup = () => {
    setChildNodes([
      ...childNodes,
      getDefaultOperatorNode(),
      getEmptyGroupNode(),
    ]);
  };

  const removeNode = (index: number) => {
    const isFirst = index === 0;
    const isLast = index === childNodes.length - 1;
    const previousNodeIndex = index - 1;
    const nextNodeIndex = index + 1;
    const previousNode =
      previousNodeIndex >= 0 ? childNodes[previousNodeIndex] : null;
    const nextNode =
      nextNodeIndex <= childNodes.length - 1 ? childNodes[nextNodeIndex] : null;
    const isPrecededByOperator = previousNode?.nodeType === "operator";
    const isFollowedByOperator = nextNode?.nodeType === "operator";

    // It is important to keep the splice calls in this order not
    // to mess up the indices

    if (isFirst && isFollowedByOperator) {
      childNodes.splice(nextNodeIndex, 1);
    }

    childNodes.splice(index, 1);

    if (
      (isLast && isPrecededByOperator) ||
      (previousNode != null && nextNode != null)
    ) {
      childNodes.splice(previousNodeIndex, 1);
    }

    // If the group became empty, fill it with one empty rule again
    if (childNodes.length === 0) {
      childNodes.push(getEmptyFieldNode());
    }

    setChildNodes([...childNodes]);
  };

  return (
    <Box
      data-testid="group"
      className="group"
      sx={(theme) => ({
        px: 0.5,
        pb: 0.5,
        borderRadius: theme.vars.shape.borderRadius,
        ...(!root && {
          mt: 1,
          ml: 11,
          border: `solid 1px ${theme.vars.palette.colors.blue}`,
          "&:hover:not(:has(.group:hover))": {
            backgroundColor: "colors.lightBlue",
            ".group": {
              backgroundColor: "white",
            },
            "& > div > div > .operator": {
              backgroundColor: "colors.lightBlue",
            },
          },
        }),
      })}
    >
      {/* Buttons */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: "end",
        }}
      >
        <MuiButton
          startIcon={<AddCircleIcon />}
          onClick={addRule}
          sx={{ color: "colors.lightGreen" }}
        >
          {t("addRule")}
        </MuiButton>
        <MuiButton
          startIcon={<AddCircleIcon />}
          onClick={addGroup}
          sx={{ color: "colors.blue" }}
        >
          {t("addGroup")}
        </MuiButton>
        <MuiButton
          color={root ? "warning" : "error"}
          startIcon={root ? <RestartAltIcon /> : <CancelIcon />}
          onClick={remove}
        >
          {root ? t("reset") : t("removeGroup")}
        </MuiButton>
      </Stack>

      <Box
        sx={{
          "& > .rule:not(:first-child)": {
            mt: 1,
          },
        }}
      >
        {childNodes.map((child, i) => {
          switch (child.nodeType) {
            case "node":
              return (
                <Rule
                  key={child.id}
                  displayErrors={displayErrors}
                  node={child}
                  setNode={(newNode: FieldNode) => {
                    const newChildNodes = [...childNodes];
                    newChildNodes[i] = newNode;
                    setChildNodes(newChildNodes);
                  }}
                  remove={() => {
                    removeNode(i);
                  }}
                />
              );

            case "group":
              return (
                <Group
                  key={child.id}
                  displayErrors={displayErrors}
                  root={child.root}
                  childNodes={child.nodes}
                  setChildNodes={(newChildren) => {
                    child.nodes = newChildren;
                    setChildNodes([...childNodes]);
                  }}
                  remove={() => {
                    removeNode(i);
                  }}
                />
              );

            case "operator":
              return (
                <Operator
                  key={child.id}
                  node={child}
                  setNode={(newNode: OperatorNode) => {
                    Object.assign(child, newNode);
                    setChildNodes([...childNodes]);
                  }}
                  previousNode={childNodes[i - 1]}
                  nextNode={childNodes[i + 1]}
                  first={child === firstOperator}
                  last={child === lastOperator}
                />
              );
            default:
              return null;
          }
        })}
      </Box>
    </Box>
  );
}
