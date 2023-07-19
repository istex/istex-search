"use client";

import { type ChangeEventHandler, useState } from "react";
import { useTranslations } from "next-intl";
import { FormControlLabel, Switch } from "@mui/material";
import AssistedSearchInput from "./AssistedSearchInput";
import RegularSearchInput from "./RegularSearchInput";
import type { ClientComponent } from "@/types/next";

const SearchInput: ClientComponent = () => {
  const t = useTranslations("home.SearchSection.SearchInput");
  const [isAssistedSearch, setIsAssistedSearch] = useState(false);

  const toggleAssistedSearch: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setIsAssistedSearch(event.target.checked);
  };

  return (
    <>
      {isAssistedSearch ? <AssistedSearchInput /> : <RegularSearchInput />}

      <FormControlLabel
        control={
          <Switch
            id="assisted-search-toggle"
            value={isAssistedSearch}
            onChange={toggleAssistedSearch}
          />
        }
        label={t("switch")}
        labelPlacement="bottom"
        sx={{ display: "none" }} // TODO: Remove when the assisted search is implemented
      />
    </>
  );
};

export default SearchInput;
