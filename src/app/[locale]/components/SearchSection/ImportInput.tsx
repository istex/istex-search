"use client";

import {
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import SearchTitle from "./SearchTitle";
import SearchLogoUpload from "@/../public/id-search-upload.svg";
import MultilineTextField from "@/components/MultilineTextField";
import { useQueryContext } from "@/contexts/QueryContext";
import { usePathname } from "@/i18n/navigation";
import {
  buildQueryFromIds,
  getIdsFromQuery,
  isValidDoi,
  isValidIstexId,
  parseCorpusFileContent,
} from "@/lib/utils";
import type { ClientComponent, ColumnId } from "@/types/next";

const ImportInput: ClientComponent<{
  searchBar: (child: ReactNode) => ReactNode;
  goToResultsPage: (
    newQueryString: string,
    setErrorMessage: (errorMessage: string) => void,
  ) => void;
}> = ({ searchBar, goToResultsPage }) => {
  const t = useTranslations("home.SearchSection.SearchInput.ImportInput");
  const tErrors = useTranslations("errors");
  const [errorMessage, setErrorMessage] = useState("");
  const [queryStringById, setQueryStringById] = useState(
    getIdsFromQuery(useQueryContext().queryString),
  );
  const onHomePage = usePathname() === "/";
  const [columnToSearch, setColumnToSearch] = useState(
    useQueryContext().queryString.split(".")[0],
  );
  const [errorLines, setErrorLines] = useState(
    buildQueryFromIds(columnToSearch as ColumnId, queryStringById).errorLines,
  );

  const corpusFileHandler = (file: File) => {
    if (!file.name.endsWith(".corpus")) {
      setErrorMessage(tErrors("fileExtensionError"));
      return;
    }
    setErrorMessage("");
    const reader = new window.FileReader();
    reader.readAsText(file, "utf-8");
    reader.onload = (event) => {
      const result = event.target?.result;
      const query = parseCorpusFileContent(result as string);
      setQueryStringById(query);
    };
    reader.onerror = () => {
      setErrorMessage(tErrors("fileReadError"));
    };
  };

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();

    const firstLine = queryStringById.split("\n")[0];
    let columnToSearch: ColumnId;
    if (isValidDoi(firstLine)) {
      columnToSearch = "doi";
    } else if (isValidIstexId(firstLine)) {
      columnToSearch = "arkIstex";
    } else {
      setErrorMessage(tErrors("invalidIdError"));
      return;
    }

    const { query, errorLines } = buildQueryFromIds(
      columnToSearch,
      queryStringById,
    );
    setColumnToSearch(columnToSearch);
    setErrorLines(errorLines);

    goToResultsPage(query, setErrorMessage);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setErrorMessage("");
    setColumnToSearch("");
    setErrorLines([]);
    setQueryStringById(event.target.value);
  };

  return (
    <Box component="form" noValidate autoCorrect="off" onSubmit={handleSubmit}>
      <SearchTitle title={onHomePage ? t("searchTitle") : t("resultsTitle")} />
      {searchBar(
        <>
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
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => {
                    document.getElementById("dropzone-file")?.click();
                  }}
                >
                  <Image src={SearchLogoUpload} alt="Upload .corpus file" />
                </IconButton>
              ),
              sx: { alignItems: "flex-start" },
            }}
          />
          <input
            id="dropzone-file"
            type="file"
            accept=".corpus"
            value=""
            style={{ display: "none" }}
            onChange={(event) => {
              event.target.files !== null &&
                corpusFileHandler(event.target.files[0]);
            }}
          />
        </>,
      )}
      {errorLines.length > 0 && (
        <Paper
          elevation={0}
          sx={(theme) => ({
            mt: 2,
            mb: -2,
            bgcolor: theme.palette.colors.lightRed,
            p: 2,
          })}
        >
          <Typography
            variant="body2"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <strong>
              {t("errorsSyntaxCount", {
                count: errorLines.length,
                type: columnToSearch,
                errorLines: errorLines.join(", "),
              })}
            </strong>
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ImportInput;
