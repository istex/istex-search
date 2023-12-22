"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Box,
  Button as MuiButton,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import Group from "./AssistedSearch/Group";
import Operator from "./AssistedSearch/Operator";
import Rule from "./AssistedSearch/Rule";
import { ast } from "./structure";
import Button from "@/components/Button";
import MultilineTextField from "@/components/MultilineTextField";
import type { ClientComponent } from "@/types/next";

const AssistedSearchInput: ClientComponent<{
  switchAssistedSearch: () => void;
}> = ({ switchAssistedSearch }) => {
  const t = useTranslations("home.SearchSection.SearchInput.AssistedInput");
  const [astInput, setAstInput] = useState("");
  const [parsedAst, setParsedAst] = useState<any[]>([]);
  const [parsingError, setParsingError] = useState(false);
  const handleSubmit = () => {
    try {
      setParsedAst(JSON.parse(astInput));
    } catch (error) {
      setParsingError(true);
    }
  };
  // TODO: change this any type when the structure is defined by Clement
  const getNodeComponent = (node: any, index: number) => {
    switch (node.nodeType) {
      case "group":
        return (
          <Group key={index} nodes={node.nodes != null ? node.nodes : []} />
        );
      case "node":
        return <Rule key={index} node={node} />;
      default:
        return <Operator key={index} operator={node.value} />;
    }
  };
  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        {t("title")}
      </Typography>

      <Stack direction="row" spacing={1}>
        <MultilineTextField
          onChange={(event) => {
            setParsingError(false);
            setAstInput(event.target.value);
          }}
          fullWidth
          minRows={3}
          placeholder="Collez ici votre objet JSON à transformer en recherche assistée"
          value={astInput}
        />
        <Button onClick={handleSubmit}>Transformer</Button>
        <Button
          onClick={() => {
            setAstInput(JSON.stringify(ast));
            setParsedAst(ast);
          }}
        >
          Utiliser le template
        </Button>
      </Stack>
      {parsingError && (
        <Box sx={{ color: "error.main" }}>Erreur de parsing JSON</Box>
      )}

      {parsedAst.length > 0 && (
        <>
          <Box py={5}>
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
              <MuiButton color="warning" startIcon={<RestartAltIcon />}>
                {t("reset")}
              </MuiButton>
            </Stack>

            {parsedAst.map((node, index) => getNodeComponent(node, index))}
          </Box>
        </>
      )}

      <Grid container>
        <Grid item xs={4}>
          <MuiButton
            sx={{ textDecoration: "underline" }}
            onClick={switchAssistedSearch}
          >
            {t("regularSearch")}
          </MuiButton>
        </Grid>
        {parsedAst.length > 0 && (
          <Grid item xs={4} textAlign="center">
            <Button>{t("button")}</Button>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default AssistedSearchInput;
