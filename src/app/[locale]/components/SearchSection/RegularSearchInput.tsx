"use client";

import {
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import { Box, Typography } from "@mui/material";
import QueryExamplesList from "./QueryExamplesList";
import MultilineTextField from "@/components/MultilineTextField";
import { useQueryContext } from "@/contexts/QueryContext";
import type { ClientComponent } from "@/types/next";

const RegularSearchInput: ClientComponent<{
  searchBar: (child: ReactNode) => ReactNode;
  goToResultsPage: (
    newQueryString: string,
    setErrorMessage: (errorMessage: string) => void,
    setQueryString: (queryString: string) => void,
  ) => void;
}> = ({ searchBar, goToResultsPage }) => {
  const t = useTranslations(
    "home.SearchSection.SearchInput.RegularSearchInput",
  );
  const [queryString, setQueryString] = useState(useQueryContext().queryString);
  const [errorMessage, setErrorMessage] = useState("");
  const onHomePage = usePathname() === "/";

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
      <Typography variant="h5" component="h1" gutterBottom>
        {onHomePage ? t("searchTitle") : t("resultsTitle")}
      </Typography>
      {searchBar(
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
        />,
      )}

      <QueryExamplesList
        goToResultsPage={(newQueryString) => {
          goToResultsPage(newQueryString, setErrorMessage, setQueryString);
        }}
      />
    </Box>
  );
};

export default RegularSearchInput;
