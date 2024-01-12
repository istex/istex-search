import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button as MuiButton, Box, Stack } from "@mui/material";
import Operator from "./Operator";
import Rule from "./Rule";
import {
  addGroup,
  addRule,
  removeNode,
  setOperator,
  setGroup as setGroupData,
  setField,
  setComparator,
  setValue,
  setRangeValue,
} from "./functions";
import type {
  AST,
  Comparator,
  Operator as OperatorType,
  Node,
} from "@/lib/queryAst";

const Group = ({
  nodes,
  displayError,
  updateData,
  remove,
}: {
  nodes: AST;
  displayError: boolean;
  updateData: (newEntry: AST) => void;
  remove: () => void;
}) => {
  const [group, setGroup] = useState(nodes);
  const t = useTranslations("home.SearchSection.SearchInput.AssistedInput");

  const getNodeComponent = (node: Node, index: number) => {
    switch (node.nodeType) {
      case "group":
        return (
          <Group
            key={index}
            nodes={node.nodes}
            displayError={displayError}
            updateData={(newEntry: Node[]) => {
              setGroupData(setGroup, group, index, newEntry);
            }}
            remove={() => {
              removeNode(setGroup, group, index);
            }}
          />
        );
      case "node":
        return (
          <Rule
            key={index}
            node={node}
            displayError={displayError}
            setField={(newField: string) => {
              setField(setGroup, group, index, newField);
            }}
            setComparator={(newComparator: Comparator) => {
              setComparator(setGroup, group, index, newComparator);
            }}
            setValue={(newValue: string | number | boolean | null) => {
              setValue(setGroup, group, index, newValue);
            }}
            setRangeValue={({
              min,
              max,
            }: {
              min?: number | null | "*";
              max?: number | null | "*";
            }) => {
              setRangeValue(setGroup, group, index, min, max);
            }}
            remove={() => {
              if (group.length === 1) remove();
              else removeNode(setGroup, group, index);
            }}
          />
        );
      default:
        return (
          <Operator
            key={index}
            operator={node.value}
            setEntry={(newOperator: OperatorType) => {
              setOperator(setGroup, group, index, newOperator);
            }}
          />
        );
    }
  };

  useEffect(() => {
    updateData(group);
  }, [group]);

  return (
    <Box
      ml={11}
      mt={1}
      sx={(theme) => ({
        border: `1px ${theme.palette.primary.light} solid`,
        borderRadius: "10px",
      })}
    >
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <MuiButton
          sx={{ color: "colors.lightGreen" }}
          startIcon={<AddCircleIcon />}
          onClick={() => {
            addRule(setGroup, group);
          }}
        >
          {t("addRule")}
        </MuiButton>
        <MuiButton
          color="info"
          startIcon={<AddCircleIcon />}
          onClick={() => {
            addGroup(setGroup, group);
          }}
        >
          {t("addGroup")}
        </MuiButton>
        <MuiButton color="error" startIcon={<CancelIcon />} onClick={remove}>
          {t("remove")}
        </MuiButton>
      </Stack>

      <Box p={0.75}>
        {group.map((node, index) => {
          return getNodeComponent(node, index);
        })}
      </Box>
    </Box>
  );
};

export default Group;
