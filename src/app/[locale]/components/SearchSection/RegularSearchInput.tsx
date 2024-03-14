"use client";

import {
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
} from "react";
import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import QueryExamplesList from "./QueryExamplesList";
import SearchBar from "./SearchBar";
import SearchTitle from "./SearchTitle";
import MultilineTextField from "@/components/MultilineTextField";
import { useQueryContext } from "@/contexts/QueryContext";
import { useOnHomePage } from "@/lib/hooks";
import type { ClientComponent } from "@/types/next";

const RegularSearchInput: ClientComponent<{
  goToResultsPage: (
    newQueryString: string,
    setErrorMessage: (errorMessage: string) => void,
    setQueryString: (queryString: string) => void,
  ) => void;
}> = ({ goToResultsPage }) => {
  const t = useTranslations(
    "home.SearchSection.SearchInput.RegularSearchInput",
  );
  const [queryString, setQueryString] = useState(useQueryContext().queryString);
  const [errorMessage, setErrorMessage] = useState("");
  const onHomePage = useOnHomePage();

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    goToResultsPage(queryString, setErrorMessage, setQueryString);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setErrorMessage("");
    setQueryString(event.target.value);
  };

  return (
    <Box component="form" noValidate autoCorrect="off" onSubmit={handleSubmit}>
      <SearchTitle />

      <SearchBar>
        <MultilineTextField
          id="regular-search-input"
          onChange={handleChange}
          onSubmit={handleSubmit}
          helperText={errorMessage}
          required
          autoFocus
          error={errorMessage !== ""}
          fullWidth
          maxRows={8}
          minRows={1}
          placeholder={t("placeholder")}
          value={queryString}
          inputProps={{
            style: {
              minHeight: "32px",
              lineHeight: "32px",
            },
          }}
          sx={{
            mb: { xs: 2, sm: 0 },
            // This targets the fieldset around the input
            "& .MuiOutlinedInput-notchedOutline": {
              borderTopRightRadius: { xs: 4, sm: 0 },
              borderBottomRightRadius: { xs: 4, sm: 0 },
            },
          }}
        />
      </SearchBar>

      {onHomePage && (
        <QueryExamplesList
          goToResultsPage={(newQueryString) => {
            goToResultsPage(newQueryString, setErrorMessage, setQueryString);
          }}
        />
      )}
    </Box>
  );
};

export default RegularSearchInput;
