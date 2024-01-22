"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import Image from "next/image";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Box,
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
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
import ExpertSearchIcon from "@/../public/expert-search-icon.svg";
import Button from "@/components/Button";
import MultilineTextField from "@/components/MultilineTextField";
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
    setQueryString?: (queryString: string) => void,
    parsedAst?: AST,
    isExpertSearch?: boolean,
  ) => void;
  loading?: boolean;
}> = ({ goToResultsPage, loading }) => {
  const t = useTranslations("home.SearchSection.SearchInput.AssistedInput");
  const tRegular = useTranslations(
    "home.SearchSection.SearchInput.RegularSearchInput",
  );
  const notOnHomePage = usePathname() !== "/";
  const searchParams = useSearchParams();
  const [isError, setIsError] = useState(false);
  const [isExpertEdition, setIsExpertEdition] = useState(false);
  const [expertQuery, setExpertQuery] = useState(
    astToString(searchParams.getAst()),
  );
  const [openExpertDialog, setOpenExpertDialog] = useState(false);
  const [stopShowMessage, setStopShowMessage] = useState(false);
  const [expertErrorMessage, setExpertErrorMessage] = useState("");
  const [parsedAst, setParsedAst] = useState(searchParams.getAst());

  const getNodeComponent = (node: Node, index: number) => {
    switch (node.nodeType) {
      case "group":
        return (
          <Box className="group">
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
          </Box>
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkAstEmptyEntry(parsedAst)) setIsError(true);
    else
      goToResultsPage(astToString(parsedAst), () => {}, undefined, parsedAst);
  };

  const initStopShowMessage = () => {
    if (localStorage.getItem("stopShowExpertMessage") !== null)
      setStopShowMessage(true);
    else setStopShowMessage(false);
  };

  const expertConfirmModifications = () => {
    if (stopShowMessage) expertSearch();
    else {
      setOpenExpertDialog(true);
    }
  };

  const expertConfirmDialog = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (stopShowMessage) localStorage.setItem("stopShowExpertMessage", "true");
    expertSearch();
  };

  const expertSearch = () => {
    goToResultsPage(
      expertQuery,
      setExpertErrorMessage,
      setExpertQuery,
      undefined,
      true,
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <SearchTitle title={t("title")} />

      {isExpertEdition ? (
        <Stack alignItems="center" justifyContent="center" mt={2}>
          <Box display="flex" sx={{ width: "100%" }}>
            <MultilineTextField
              onChange={(e) => {
                setExpertErrorMessage("");
                setExpertQuery(e.target.value);
              }}
              onSubmit={expertConfirmModifications}
              helperText={expertErrorMessage}
              autoFocus
              error={expertErrorMessage !== ""}
              fullWidth
              maxRows={8}
              placeholder={tRegular("placeholder")}
              value={expertQuery}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="text"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
              }}
              onClick={() => {
                setIsExpertEdition(false);
                setIsError(false);
                if (expertQuery !== astToString(parsedAst)) reset(setParsedAst);
              }}
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  padding: "5px",
                  borderRadius: "100%",
                  height: "34px",
                  mb: 0.5,
                }}
              >
                <ArrowBackIcon />
              </Box>
              <Typography
                sx={{
                  color: "black",
                  fontSize: "7px",
                  fontWeight: 400,
                }}
              >
                {t("assistedButton")}
              </Typography>
            </Button>
          </Box>
          <Button sx={{ mt: 2 }} onClick={expertConfirmModifications}>
            {t("validate")}
          </Button>
        </Stack>
      ) : (
        <>
          {notOnHomePage && (
            <Box
              sx={(theme) => ({
                bgcolor: theme.palette.colors.veryLightBlue,
                display: "flex",
                mt: 2,
              })}
            >
              <Typography sx={{ flexGrow: 1, p: "20px" }}>
                {astToString(searchParams.getAst())}
              </Typography>
              <Button
                variant="text"
                sx={{
                  color: "black",
                  fontSize: "7px",
                  fontWeight: 400,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                onClick={() => {
                  initStopShowMessage();
                  setIsExpertEdition(true);
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "white",
                    padding: "5px",
                    borderRadius: "100%",
                    mb: 0.5,
                  }}
                >
                  <Image src={ExpertSearchIcon} alt="expert-edit" />
                </Box>
                {t("editionButton")}
              </Button>
            </Box>
          )}
          <Box pb={5} pt={2}>
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
                    localStorage.removeItem("assistedAST");
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
        </>
      )}

      <Dialog
        open={openExpertDialog}
        onClose={() => {
          initStopShowMessage();
          setOpenExpertDialog(false);
        }}
      >
        <DialogTitle>{t("Dialog.title")}</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          {t("Dialog.content")}
          <DialogContentText sx={{ pt: 2.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={stopShowMessage}
                  onChange={(e) => {
                    setStopShowMessage(e.target.checked);
                  }}
                />
              }
              label={t("Dialog.remember")}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pt: 0 }}>
          <Button variant="text" onClick={expertConfirmDialog} autoFocus>
            {t("Dialog.confirm")}
          </Button>
          <Button
            variant="text"
            onClick={() => {
              initStopShowMessage();
              setOpenExpertDialog(false);
            }}
          >
            {t("Dialog.cancel")}
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default AssistedSearchInput;
