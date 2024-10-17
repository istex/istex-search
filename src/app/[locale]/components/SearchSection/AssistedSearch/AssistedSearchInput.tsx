import * as React from "react";
import { useTranslations } from "next-intl";
import { Box, Stack } from "@mui/material";
import SearchButton from "../SearchButton";
import SearchTitle from "../SearchTitle";
import ExpertSearchInput from "./ExpertSearchInput";
import Group from "./Group";
import QueryPanel from "./QueryPanel";
import ErrorCard from "@/components/ErrorCard";
import { SEARCH_MODE_REGULAR } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import CustomError from "@/lib/CustomError";
import {
  astContainsPartialNode,
  astToString,
  getEmptyFieldNode,
} from "@/lib/ast";
import { useOnHomePage, useSearchParams } from "@/lib/hooks";

export default function AssistedSearchInput() {
  const tErrors = useTranslations("errors");
  const searchParams = useSearchParams();
  const ast = searchParams.getAst();
  const queryString = astToString(ast);
  const { goToResultsPage, errorInfo } = useQueryContext();
  const onHomePage = useOnHomePage();
  const [assistedFormOpen, setAssistedFormOpen] = React.useState(onHomePage);
  const [expertInputOpen, setExpertInputOpen] = React.useState(false);
  const [expertQueryString, setExpertQueryString] = React.useState(queryString);
  const [expertErrorMessage, setExpertErrorMessage] = React.useState("");
  const [expertValidateModalOpen, setExpertValidateModalOpen] =
    React.useState(false);
  const [error, setError] = React.useState<CustomError | null>(
    errorInfo != null ? new CustomError(errorInfo) : null,
  );
  const displayErrors = error != null;

  const rootNode = ast[0];
  if (
    rootNode.nodeType !== "group" ||
    rootNode.root == null ||
    !rootNode.root ||
    ast.length !== 1
  ) {
    throw new Error("There can only be 1 root node and it needs to be a group");
  }

  const [childNodes, setChildNodes] = React.useState(rootNode.nodes);

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    setError(null);

    let newQueryString;

    // Use the expert query when in expert mode
    if (expertInputOpen) {
      newQueryString = expertQueryString;

      if (newQueryString.trim() === "") {
        setExpertErrorMessage(tErrors("emptyQueryError"));
        return;
      }

      // If the modal isn't open, open it and return to let the next handleSubmit
      // call go to the results page
      if (!expertValidateModalOpen) {
        setExpertValidateModalOpen(true);
        return;
      } else {
        // If the modal has already been opened, close it
        setExpertValidateModalOpen(false);
      }
    } else {
      if (astContainsPartialNode(ast)) {
        setError(new CustomError({ name: "PartialAstError" }));
        return;
      }

      newQueryString = astToString(ast);
    }

    if (expertInputOpen) {
      searchParams.deleteAst();
      searchParams.setSearchMode(SEARCH_MODE_REGULAR);
    } else {
      searchParams.setAst(ast);
    }

    goToResultsPage(newQueryString, searchParams).catch((err: unknown) => {
      if (err instanceof CustomError) {
        setError(err);
      }
    });
  };

  const reset = () => {
    setChildNodes([getEmptyFieldNode()]);
  };

  React.useEffect(() => {
    rootNode.nodes = childNodes;
  }, [rootNode, childNodes]);

  return (
    <Box component="form" noValidate autoCorrect="off" onSubmit={handleSubmit}>
      <SearchTitle />

      <Stack spacing={2} sx={{ pt: 1 }}>
        {!onHomePage && !expertInputOpen && queryString !== "" && (
          <QueryPanel
            ast={ast}
            displayAssistedEditButton={!assistedFormOpen}
            onAssistedEditClick={() => {
              setAssistedFormOpen(true);
              setExpertInputOpen(false);
            }}
            onExpertEditClick={() => {
              setAssistedFormOpen(false);
              setExpertInputOpen(true);
            }}
          />
        )}

        {assistedFormOpen && (
          <>
            <Stack spacing={2} sx={{ pb: 3 }}>
              <Group
                root={rootNode.root}
                childNodes={childNodes}
                setChildNodes={setChildNodes}
                displayErrors={displayErrors}
                remove={reset}
              />

              {error != null && <ErrorCard info={error.info} />}
            </Stack>

            <SearchButton isAlone />
          </>
        )}

        {expertInputOpen && (
          <ExpertSearchInput
            queryString={expertQueryString}
            setQueryString={setExpertQueryString}
            errorMessage={expertErrorMessage}
            setErrorMessage={setExpertErrorMessage}
            modalOpen={expertValidateModalOpen}
            setModalOpen={setExpertValidateModalOpen}
            onSubmit={handleSubmit}
            hide={() => {
              setExpertInputOpen(false);
            }}
          />
        )}
      </Stack>
    </Box>
  );
}
