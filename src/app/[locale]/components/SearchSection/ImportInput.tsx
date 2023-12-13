"use client";

import {
  type ChangeEventHandler,
  type FormEventHandler,
  type ReactNode,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useSelectedLayoutSegment } from "next/navigation";
import { Box, Typography } from "@mui/material";
import MultilineTextField from "@/components/MultilineTextField";
import { useQueryContext } from "@/contexts/QueryContext";
import type CustomError from "@/lib/CustomError";
import useSearchParams from "@/lib/useSearchParams";
import {
  buildQueryFromIds,
  getIdsFromQuery,
  isValidDoi,
  isValidIstexId,
} from "@/lib/utils";
import type { ClientComponent } from "@/types/next";

const ImportInput: ClientComponent<{
  searchBar: (child: ReactNode) => ReactNode;
}> = ({ searchBar }) => {
  const t = useTranslations("home.SearchSection.SearchInput.ImportInput");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const urlSegment = useSelectedLayoutSegment();
  const searchParams = useSearchParams();
  const [queryStringById, setQueryStringById] = useState(
    getIdsFromQuery(useQueryContext().queryString),
  );
  const [errorMessage, setErrorMessage] = useState("");

  const goToResultsPage = (newQueryString: string) => {
    if (newQueryString.trim() === "") {
      setErrorMessage(tErrors("emptyIdsError"));
      return;
    }

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

    const firstLine = queryStringById.split("\n")[0];
    let columnToSearch;
    if (isValidDoi(firstLine)) {
      columnToSearch = "doi";
    } else if (isValidIstexId(firstLine)) {
      columnToSearch = "arkIstex";
    } else {
      setErrorMessage(tErrors("invalidIdError"));
      return;
    }

    const buildIdsQuery = buildQueryFromIds(queryStringById);

    goToResultsPage(`${columnToSearch}:${buildIdsQuery}`);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setErrorMessage("");
    setQueryStringById(event.target.value);
  };

  return (
    <Box component="form" noValidate autoCorrect="off" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h1" gutterBottom>
        {/*  fix urlSegment */}
        {urlSegment === "results" ? t("resultsTitle") : t("searchTitle")}
      </Typography>
      {searchBar(
        <MultilineTextField
          id="import-search-input"
          onChange={handleChange}
          onSubmit={handleSubmit}
          helperText={errorMessage}
          required
          autoFocus
          error={errorMessage !== ""}
          fullWidth
          maxRows={8}
          minRows={5}
          placeholder={t("placeholder")}
          value={queryStringById}
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
    </Box>
  );
};

export default ImportInput;
