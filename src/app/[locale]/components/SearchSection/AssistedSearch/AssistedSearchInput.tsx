"use client";

import { useEffect, useState, type FormEventHandler } from "react";
import { useTranslations } from "next-intl";
import { Box, Stack } from "@mui/material";
import { useDocumentContext } from "../../../results/Document/DocumentContext";
import SearchButton from "../SearchButton";
import SearchTitle from "../SearchTitle";
import ExpertSearchInput from "./ExpertSearchInput";
import Group from "./Group";
import QueryPanel from "./QueryPanel";
import ErrorCard from "@/components/ErrorCard";
import { useRouter } from "@/i18n/navigation";
import CustomError from "@/lib/CustomError";
import {
  astContainsPartialNode,
  astToString,
  getEmptyFieldNode,
} from "@/lib/assistedSearch/ast";
import { useOnHomePage } from "@/lib/hooks";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const AssistedSearchInput: ClientComponent = () => {
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const searchParams = useSearchParams();
  const ast = searchParams.getAst();
  const queryString = astToString(ast);
  const { resetSelectedExcludedDocuments } = useDocumentContext();
  const onHomePage = useOnHomePage();
  const [assistedFormOpen, setAssistedFormOpen] = useState(onHomePage);
  const [expertInputOpen, setExpertInputOpen] = useState(false);
  const [expertQueryString, setExpertQueryString] = useState(queryString);
  const [expertErrorMessage, setExpertErrorMessage] = useState("");
  const [expertValidateModalOpen, setExpertValidateModalOpen] = useState(false);
  const [error, setError] = useState<CustomError | null>(null);
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

  const [childNodes, setChildNodes] = useState(rootNode.nodes);

  const handleSubmit: FormEventHandler = (event) => {
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
      newQueryString = astToString(ast);

      if (astContainsPartialNode(ast)) {
        setError(new CustomError({ name: "PartialAstError" }));
        return;
      }
    }

    goToResultsPage(newQueryString);
  };

  const goToResultsPage = (newQueryString: string) => {
    localStorage.setItem("lastQueryString", newQueryString);

    if (expertInputOpen) {
      searchParams.deleteAst();
      searchParams.setSearchMode("regular");
    } else {
      searchParams.setAst(ast);
    }

    searchParams.deleteSize();
    searchParams.deletePage();
    searchParams.deleteFilters();

    searchParams
      .setQueryString(newQueryString)
      .then(() => {
        router.push(`/results?${searchParams.toString()}`);
        resetSelectedExcludedDocuments();
      })
      .catch(setError);
  };

  const reset = () => {
    setChildNodes([getEmptyFieldNode()]);
  };

  useEffect(() => {
    rootNode.nodes = childNodes;
  }, [rootNode, childNodes]);

  return (
    <Box component="form" noValidate autoCorrect="off" onSubmit={handleSubmit}>
      <SearchTitle />

      <Stack spacing={2} sx={{ pt: 2 }}>
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

              {error != null && <ErrorCard {...error.info} />}
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
};

export default AssistedSearchInput;
