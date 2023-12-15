"use client";

import {
  type ChangeEventHandler,
  type FormEventHandler,
  type ReactNode,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import SearchLogoUpload from "@/../public/id-search-upload.svg";
import MultilineTextField from "@/components/MultilineTextField";
import { useQueryContext } from "@/contexts/QueryContext";
import type CustomError from "@/lib/CustomError";
import useSearchParams from "@/lib/useSearchParams";
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
}> = ({ searchBar }) => {
  const t = useTranslations("home.SearchSection.SearchInput.ImportInput");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const urlSegment = useSelectedLayoutSegment();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [columnToSearch, setColumnToSearch] = useState("");
  const [errorLines, setErrorLines] = useState<number[]>([]);
  const [queryStringById, setQueryStringById] = useState(
    getIdsFromQuery(useQueryContext().queryString),
  );

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

  const corpusFileHandler = (file: Blob) => {
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

    goToResultsPage(query);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setErrorMessage("");
    setColumnToSearch("");
    setErrorLines([]);
    setQueryStringById(event.target.value);
  };

  return (
    <Box component="form" noValidate autoCorrect="off" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h1" gutterBottom>
        {/*  fix urlSegment */}
        {urlSegment === "results" ? t("resultsTitle") : t("searchTitle")}
      </Typography>
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
