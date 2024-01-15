"use client";

import { useState, type ReactNode } from "react";
import ImportInput from "./ImportInput";
import RegularSearchInput from "./RegularSearchInput";
import SearchBar from "./SearchBar";
import type { ClientComponent } from "@/types/next";

const SearchInput: ClientComponent<{
  goToResultsPage: (
    newQueryString: string,
    setErrorMessage: (errorMessage: string) => void,
  ) => void;
  switchAssistedSearch: () => void;
  loading?: boolean;
}> = ({ goToResultsPage, switchAssistedSearch, loading }) => {
  const [isSearchById, setIsSearchById] = useState(false);

  const searchBar = (child: ReactNode) => {
    return (
      <SearchBar
        switchAssistedSearch={switchAssistedSearch}
        isSearchById={isSearchById}
        switchSearchById={() => {
          setIsSearchById(!isSearchById);
        }}
        loading={loading}
      >
        {child}
      </SearchBar>
    );
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
