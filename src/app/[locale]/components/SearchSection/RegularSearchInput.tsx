"use client";

import {
  type ChangeEventHandler,
  type FormEventHandler,
  type ReactNode,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { Box, Typography } from "@mui/material";
import QueryExamplesList from "./QueryExamplesList";
import MultilineTextField from "@/components/MultilineTextField";
import { useQueryContext } from "@/contexts/QueryContext";
import type CustomError from "@/lib/CustomError";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const RegularSearchInput: ClientComponent<{
  searchBar: (child: ReactNode) => ReactNode;
}> = ({ searchBar }) => {
  const t = useTranslations(
    "home.SearchSection.SearchInput.RegularSearchInput",
  );
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queryString, setQueryString] = useState(useQueryContext().queryString);
  const [errorMessage, setErrorMessage] = useState("");
  const onHomePage = usePathname() === "/";

  const goToResultsPage = (newQueryString: string) => {
    if (newQueryString.trim() === "") {
      setErrorMessage(tErrors("emptyQueryError"));
      return;
    }

    setQueryString(newQueryString);

    searchParams.deleteSize();
    searchParams.deletePage();
    searchParams
      .setQueryString(newQueryString)
      .then(() => {
        router.push(`/results?${searchParams.toString()}`);
      })
      .catch((err: CustomError) => {
        setErrorMessage(tErrors(err.info.name));
      });
  };

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    goToResultsPage(queryString);
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
            style: { minHeight: "32px" },
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

      <QueryExamplesList goToResultsPage={goToResultsPage} />
    </Box>
  );
};

export default RegularSearchInput;
