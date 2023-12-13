"use client";

import { type ReactNode, useState } from "react";
import ImportInput from "./ImportInput";
import RegularSearchInput from "./RegularSearchInput";
import SearchBar from "./SearchBar";
import type { ClientComponent } from "@/types/next";

const SearchInput: ClientComponent = () => {
  const [isSearchById, setIsSearchById] = useState(false);

  const searchBar = (child: ReactNode) => {
    return (
      <SearchBar
        isSearchById={isSearchById}
        switchSearchMode={() => {
          setIsSearchById(!isSearchById);
        }}
      >
        {child}
      </SearchBar>
    );
  };

  return (
    <>
      {isSearchById ? (
        <ImportInput searchBar={searchBar} />
      ) : (
        <RegularSearchInput searchBar={searchBar} />
      )}
    </>
  );
};

export default SearchInput;
