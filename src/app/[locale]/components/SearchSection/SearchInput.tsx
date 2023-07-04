"use client";

import { type ChangeEventHandler, useState } from "react";
import { FormControlLabel, Switch } from "@/mui/material";
import AssistedSearchInput from "./AssistedSearchInput";
import RegularSearchInput, {
  type RegularSearchInputLabels,
} from "./RegularSearchInput";
import type { ClientComponent } from "@/types/next";

export interface SearchInputLabels {
  RegularSearchInput: RegularSearchInputLabels;
  switch: string;
}

const SearchInput: ClientComponent<{ labels: SearchInputLabels }> = ({
  labels,
}) => {
  const [isAssistedSearch, setIsAssistedSearch] = useState(false);

  const toggleAssistedSearch: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setIsAssistedSearch(event.target.checked);
  };

  return (
    <>
      {isAssistedSearch ? (
        <AssistedSearchInput />
      ) : (
        <RegularSearchInput labels={labels.RegularSearchInput} />
      )}

      <FormControlLabel
        control={
          <Switch
            id="assisted-search-toggle"
            value={isAssistedSearch}
            onChange={toggleAssistedSearch}
          />
        }
        label={labels.switch}
        labelPlacement="bottom"
        sx={{ display: "none" }} // TODO: Remove when the assisted search is implemented
      />
    </>
  );
};

export default SearchInput;
