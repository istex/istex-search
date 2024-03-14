"use client";

import { useTranslations } from "next-intl";
import { Box, Container } from "@mui/material";
import { useDocumentContext } from "../../results/Document/DocumentContext";
import AssistedSearchInput from "./AssistedSearch/AssistedSearchInput";
import ImportInput from "./ImportInput";
import RegularSearchInput from "./RegularSearchInput";
import {
  SEARCH_MODE_ASSISTED,
  SEARCH_MODE_IMPORT,
  SEARCH_MODE_REGULAR,
} from "@/config";
import { useRouter } from "@/i18n/navigation";
import type CustomError from "@/lib/CustomError";
import type { AST } from "@/lib/assistedSearch/ast";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const SearchSection: ClientComponent = () => {
  const searchParams = useSearchParams();
  const searchMode = searchParams.getSearchMode();
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const { resetSelectedExcludedDocuments } = useDocumentContext();

  const goToResultsPage = (
    newQueryString: string,
    setErrorMessage: (errorMessage: string) => void,
    setQueryString?: (queryString: string) => void,
    parsedAst?: AST,
    isExpertSearch?: boolean,
  ) => {
    if (newQueryString.trim() === "") {
      setErrorMessage(tErrors("emptyQueryError"));
      return;
    }

    if (setQueryString !== undefined) setQueryString(newQueryString);
    localStorage.setItem("lastQueryString", newQueryString);

    searchParams.deleteSize();
    searchParams.deletePage();
    searchParams.deleteFilters();

    if (isExpertSearch === true) {
      searchParams.setSearchMode(SEARCH_MODE_REGULAR);
      searchParams.deleteAst();
    }
    if (parsedAst !== undefined) {
      searchParams.setAst(parsedAst);
    }
    searchParams
      .setQueryString(newQueryString)
      .then(() => {
        router.push(`/results?${searchParams.toString()}`);
        resetSelectedExcludedDocuments();
      })
      .catch((err: CustomError) => {
        setErrorMessage(tErrors(err.info.name));
      });
  };

  const getSearchComponent = () => {
    switch (searchMode) {
      case SEARCH_MODE_REGULAR:
        return <RegularSearchInput goToResultsPage={goToResultsPage} />;
      case SEARCH_MODE_ASSISTED:
        return <AssistedSearchInput />;
      case SEARCH_MODE_IMPORT:
        return <ImportInput />;
    }
  };

  return (
    <Container component="section" sx={{ py: 3 }}>
      <Box
        sx={{
          justifyContent: "flex-end",
        }}
      >
        {getSearchComponent()}
      </Box>
    </Container>
  );
};

export default SearchSection;
