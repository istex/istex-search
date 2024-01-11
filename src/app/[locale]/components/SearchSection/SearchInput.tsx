"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useDocumentContext } from "../../results/Document/DocumentContext";
import ImportInput from "./ImportInput";
import RegularSearchInput from "./RegularSearchInput";
import SearchBar from "./SearchBar";
import type CustomError from "@/lib/CustomError";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const SearchInput: ClientComponent<{ switchAssistedSearch: () => void }> = ({
  switchAssistedSearch,
}) => {
  const [isSearchById, setIsSearchById] = useState(false);
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetSelectedExcludedDocuments } = useDocumentContext();

  const searchBar = (child: ReactNode) => {
    return (
      <SearchBar
        switchAssistedSearch={switchAssistedSearch}
        isSearchById={isSearchById}
        switchSearchById={() => {
          setIsSearchById(!isSearchById);
        }}
      >
        {child}
      </SearchBar>
    );
  };

  const goToResultsPage = (
    newQueryString: string,
    setErrorMessage: (errorMessage: string) => void,
    setQueryString?: (queryString: string) => void,
  ) => {
    if (newQueryString.trim() === "") {
      setErrorMessage(tErrors("emptyQueryError"));
      return;
    }

    if (setQueryString !== undefined) setQueryString(newQueryString);

    searchParams.deleteSize();
    searchParams.deletePage();
    searchParams.deleteFilters();
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

  return (
    <>
      {isSearchById ? (
        <ImportInput searchBar={searchBar} goToResultsPage={goToResultsPage} />
      ) : (
        <RegularSearchInput
          searchBar={searchBar}
          goToResultsPage={goToResultsPage}
        />
      )}
    </>
  );
};

export default SearchInput;
