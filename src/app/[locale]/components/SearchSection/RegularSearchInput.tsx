"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import ExamplesList from "./ExamplesList";
import SearchBar from "./SearchBar";
import SearchTitle from "./SearchTitle";
import ErrorCard from "@/components/ErrorCard";
import MultilineTextField from "@/components/MultilineTextField";
import { useQueryContext } from "@/contexts/QueryContext";
import CustomError from "@/lib/CustomError";
import { useOnHomePage } from "@/lib/hooks";
import type { ClientComponent } from "@/types/next";

const RegularSearchInput: ClientComponent = () => {
  const t = useTranslations("home.SearchSection.RegularSearchInput");
  const queryContext = useQueryContext();
  const [queryString, setQueryString] = React.useState(
    queryContext.queryString,
  );
  const [error, setError] = React.useState<CustomError | null>(
    queryContext.errorInfo != null
      ? new CustomError(queryContext.errorInfo)
      : null,
  );
  const { goToResultsPage } = useQueryContext();
  const onHomePage = useOnHomePage();

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    const trimmedQueryString = queryString.trim();
    if (trimmedQueryString === "") {
      setError(new CustomError({ name: "EmptyQueryError" }));
      return;
    }

    goToResultsPage(queryString).catch((err: unknown) => {
      if (err instanceof CustomError) {
        setError(err);
      }
    });
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setError(null);
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
          required
          autoFocus
          error={error != null}
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

      {error != null && <ErrorCard info={error.info} sx={{ mt: 2 }} />}

      {onHomePage && <ExamplesList setError={setError} />}
    </Box>
  );
};

export default RegularSearchInput;
