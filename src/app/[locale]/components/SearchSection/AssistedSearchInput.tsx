"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, Button as MuiButton, Typography, Stack } from "@mui/material";
import Group from "./AssistedSearch/Group";
import Operator from "./AssistedSearch/Operator";
import Rule from "./AssistedSearch/Rule";
import {
  emptyRule,
  addGroup,
  addRule,
  removeNode,
  reset,
  setOperator,
  setGroup,
  setField,
  setComparator,
  setValue,
  setRangeValue,
  getHeight,
} from "./AssistedSearch/utils";
import SearchButton from "./SearchButton";
import SearchTitle from "./SearchTitle";
import {
  astToString,
  type AST,
  type Comparator,
  type Node,
  type Operator as OperatorType,
} from "@/lib/queryAst";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const AssistedSearchInput: ClientComponent<{
  goToResultsPage: (
    newQueryString: string,
    setErrorMessage: (errorMessage: string) => void,
    setQueryString: undefined,
    parsedAst: AST,
  ) => void;
  loading?: boolean;
}> = ({ goToResultsPage, loading }) => {
  const t = useTranslations("home.SearchSection.SearchInput.AssistedInput");
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();
  const [parsedAst, setParsedAst] = useState(searchParams.getAst());

  const getNodeComponent = (node: Node, index: number) => {
    switch (node.nodeType) {
      case "group":
        return (
          <Group
            key={index}
            nodes={node.nodes}
            displayError={isError}
            updateData={(newEntry: AST) => {
              setGroup(setParsedAst, parsedAst, index, newEntry);
            }}
            remove={() => {
              removeNode(setParsedAst, parsedAst, index);
            }}
          />
        );
      case "node":
        return (
          <Rule
            key={index}
            node={node}
            displayError={isError}
            setField={(newField: string) => {
              setField(setParsedAst, parsedAst, index, newField);
            }}
            setComparator={(newComparator: Comparator) => {
              setComparator(setParsedAst, parsedAst, index, newComparator);
            }}
            setValue={(newValue: string | number | boolean | null) => {
              setValue(setParsedAst, parsedAst, index, newValue);
            }}
            setRangeValue={({
              min,
              max,
            }: {
              min?: number | null | "*";
              max?: number | null | "*";
            }) => {
              setRangeValue(setParsedAst, parsedAst, index, min, max);
            }}
            remove={() => {
              removeNode(setParsedAst, parsedAst, index);
            }}
          />
        );
      default:
        return (
          <Operator
            key={index}
            operator={node.value}
            setEntry={(newOperator: OperatorType) => {
              setOperator(setParsedAst, parsedAst, index, newOperator);
            }}
            isFirstOperator={index === 1}
            isLastOperator={index === parsedAst.length - 2}
            precedentNodeHeight={getHeight(parsedAst[index - 1])}
            nextNodeHeight={getHeight(parsedAst[index + 1])}
          />
        );
    }
  };

  const checkAstEmptyEntry = (element: any): boolean => {
    return Object.values(element).some((value) => {
      if (value === null || value === "") return true;
      if (typeof value === "object") {
        return checkAstEmptyEntry(value);
      }
      return false;
    });
  };

  const search = () => {
    const query = astToString(parsedAst);
    goToResultsPage(query, () => {}, undefined, parsedAst);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkAstEmptyEntry(parsedAst)) setIsError(true);
    else search();
  };

  return (
    <form onSubmit={handleSubmit}>
      <SearchTitle title={t("title")} />

      <Box py={5}>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing="10px"
          mb="-10px"
        >
          <MuiButton
            sx={{ color: "colors.lightGreen" }}
            startIcon={<AddCircleIcon />}
            onClick={() => {
              addRule(setParsedAst, parsedAst);
            }}
          >
            {t("addRule")}
          </MuiButton>
          <MuiButton
            color="info"
            startIcon={<AddCircleIcon />}
            onClick={() => {
              addGroup(setParsedAst, parsedAst);
            }}
          >
            {t("addGroup")}
          </MuiButton>
          {JSON.stringify(parsedAst) !== JSON.stringify([emptyRule]) && (
            <MuiButton
              color="warning"
              startIcon={<RestartAltIcon />}
              onClick={() => {
                reset(setParsedAst);
                setIsError(false);
              }}
            >
              {t("reset")}
            </MuiButton>
          )}
        </Stack>

        {parsedAst.length > 0 &&
          parsedAst.map((node, index) => getNodeComponent(node, index))}
      </Box>

      {isError && <Typography color="error">{t("error")}</Typography>}
      <Stack alignItems="center">
        <SearchButton loading={loading} isAlone />
      </Stack>
    </form>
  );
};

export default AssistedSearchInput;
