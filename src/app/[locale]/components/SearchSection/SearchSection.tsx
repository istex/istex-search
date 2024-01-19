"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { Box, Container } from "@mui/material";
import { useDocumentContext } from "../../results/Document/DocumentContext";
import AssistedSearchInput from "./AssistedSearchInput";
import ImportInput from "./ImportInput";
import RegularSearchInput from "./RegularSearchInput";
import SearchBar from "./SearchBar";
import type CustomError from "@/lib/CustomError";
import type { AST } from "@/lib/queryAst";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const SearchSection: ClientComponent<{ loading?: boolean }> = ({ loading }) => {
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
  ) => {
    if (newQueryString !== undefined && newQueryString.trim() === "") {
      setErrorMessage(tErrors("emptyQueryError"));
      return;
    }

    if (newQueryString !== undefined && setQueryString !== undefined)
      setQueryString(newQueryString);
    if (newQueryString !== undefined)
      localStorage.setItem("lastQueryString", newQueryString);

    searchParams.deleteSize();
    searchParams.deletePage();
    searchParams.deleteFilters();

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

  const searchBar = (child: ReactNode) => {
    return <SearchBar loading={loading}>{child}</SearchBar>;
  };

  const getSearchComponent = () => {
    switch (searchMode) {
      case "regular":
        return (
          <RegularSearchInput
            searchBar={searchBar}
            goToResultsPage={goToResultsPage}
          />
        );
      case "advanced":
        return (
          <ImportInput
            searchBar={searchBar}
            goToResultsPage={goToResultsPage}
          />
        );
      case "assisted":
        return (
          <AssistedSearchInput
            loading={loading}
            goToResultsPage={goToResultsPage}
          />
        );
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
