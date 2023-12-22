import React from "react";
import { useTranslations } from "next-intl";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button as MuiButton, Box, Stack } from "@mui/material";
import Operator from "./Operator";
import Rule from "./Rule";

// TODO: remove "any" type when the structure is defined by Clement
const Group = ({ nodes }: { nodes: any[] }) => {
  const t = useTranslations("home.SearchSection.SearchInput.AssistedInput");
  // TODO: remove "any" type when the structure is defined by Clement
  const getNodeComponent = (node: any, index: number) => {
    switch (node.nodeType) {
      case "group":
        return <Group key={index} nodes={node.nodes} />;
      case "node":
        return <Rule key={index} node={node} />;
      default:
        return <Operator key={index} operator={node.value} />;
    }
  };
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
        >
          {t("addRule")}
        </MuiButton>
        <MuiButton color="info" startIcon={<AddCircleIcon />}>
          {t("addGroup")}
        </MuiButton>
        <MuiButton color="error" startIcon={<CancelIcon />}>
          {t("remove")}
        </MuiButton>
      </Stack>

      <Box p={0.75}>
        {nodes.map((node, index) => {
          return getNodeComponent(node, index);
        })}
      </Box>
    </Box>
  );
};

export default Group;
