import { Box, IconButton } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import SearchLogoUpload from "@/../public/id-search-upload.svg";
import ErrorCard from "@/components/ErrorCard";
import MultilineTextField from "@/components/MultilineTextField";
import { useQueryContext } from "@/contexts/QueryContext";
import CustomError from "@/lib/CustomError";
import {
  buildQueryStringFromIds,
  type CorpusFileParsingResult,
  getIdsFromQueryString,
  getIdTypeFromId,
  getIdTypeFromQueryString,
  parseCorpusFileContent,
} from "@/lib/queryIds";
import SearchButton from "./SearchButton";
import SearchTitle from "./SearchTitle";

export default function ImportInput() {
  const t = useTranslations("home.SearchSection.ImportInput");
  const { queryString, goToResultsPage, errorInfo } = useQueryContext();
  const idType = getIdTypeFromQueryString(queryString);
  const [idList, setIdList] = React.useState(
    getIdsFromQueryString(idType, queryString).join("\n"),
  );
  const [error, setError] = React.useState<CustomError | null>(
    errorInfo != null ? new CustomError(errorInfo) : null,
  );
  const fileInputRef = React.useRef<React.ComponentRef<"input">>(null);

  // error.info.lines is a string because that's what the next-intl expects for translation
  // values, so we need to split it to get the IDs as numbers
  const errorLines =
    error?.info.name === "IdsError"
      ? error.info.lines
          .split(", ")
          .map(Number)
          .filter((id) => !Number.isNaN(id))
      : undefined;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setError(null);
    setIdList(event.target.value);
  };

  const handleSubmit: React.SubmitEventHandler = (event) => {
    event.preventDefault();
    setError(null);

    const ids = idList.split("\n");
    const firstId = ids.find((id) => id.trim() !== "");

    if (firstId == null) {
      setError(new CustomError({ name: "EmptyIdsError" }));
      return;
    }

    // The ID type of the whole list is based on the ID type of the first ID
    let newQueryString: string;
    try {
      const newIdType = getIdTypeFromId(firstId);
      if (newIdType == null) {
        throw new CustomError({ name: "IdTypeNotSupportedError", id: firstId });
      }

      newQueryString = buildQueryStringFromIds(newIdType, ids);
    } catch (err) {
      if (err instanceof CustomError) {
        setError(err);
      }
      return;
    }

    goToResultsPage(newQueryString).catch((err: unknown) => {
      if (err instanceof CustomError) {
        setError(err);
      }
    });
  };

  const handleCorpusFile: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file, "utf-8");

    reader.onload = (event) => {
      const corpusFileContent =
        typeof event.target?.result === "string" ? event.target.result : null;

      if (corpusFileContent == null) {
        return;
      }

      let parsingResult: CorpusFileParsingResult;
      try {
        parsingResult = parseCorpusFileContent(corpusFileContent);
      } catch (err) {
        if (err instanceof CustomError) {
          setError(err);
        }
        return;
      }

      goToResultsPage(parsingResult.queryString).catch((err: unknown) => {
        if (err instanceof CustomError) {
          setError(err);
        }
      });
    };

    reader.onerror = () => {
      setError(new CustomError({ name: "FileReadError" }));
    };
  };

  return (
    <Box component="form" noValidate autoCorrect="off" onSubmit={handleSubmit}>
      <SearchTitle />

      <Box
        sx={{
          mt: 1,
          display: { xs: "block", sm: "flex" },
        }}
      >
        <MultilineTextField
          name="import-input"
          required
          autoFocus
          fullWidth
          showLineNumbers
          maxRows={8}
          minRows={5}
          placeholder={t("placeholder")}
          error={error != null}
          errorLines={errorLines}
          value={idList}
          onChange={handleChange}
          onSubmit={handleSubmit}
          sx={{
            mb: { xs: 2, sm: 0 },
            // This targets the fieldset around the input
            "& .MuiOutlinedInput-notchedOutline": {
              borderTopRightRadius: { xs: 4, sm: 0 },
              borderBottomRightRadius: { xs: 4, sm: 0 },
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <IconButton
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                >
                  <Image
                    src={SearchLogoUpload}
                    alt={t("uploadIconAlt")}
                    title={t("uploadIconAlt")}
                  />
                </IconButton>
              ),
              sx: { alignItems: "flex-start" },
            },
          }}
        />

        <input
          data-testid="corpus-file-input"
          ref={fileInputRef}
          type="file"
          accept=".corpus"
          style={{ display: "none" }}
          onChange={handleCorpusFile}
        />

        <SearchButton />
      </Box>

      {error != null && <ErrorCard info={error.info} sx={{ mt: 2 }} />}
    </Box>
  );
}
