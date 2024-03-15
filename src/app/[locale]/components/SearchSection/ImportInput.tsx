"use client";

import {
  type ChangeEventHandler,
  type ElementRef,
  type FormEventHandler,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box, IconButton } from "@mui/material";
import SearchBar from "./SearchBar";
import SearchTitle from "./SearchTitle";
import SearchLogoUpload from "@/../public/id-search-upload.svg";
import ErrorCard from "@/components/ErrorCard";
import MultilineTextField from "@/components/MultilineTextField";
import { useQueryContext } from "@/contexts/QueryContext";
import CustomError from "@/lib/CustomError";
import {
  buildQueryStringFromIds,
  getIdTypeFromId,
  getIdTypeFromQueryString,
  getIdsFromQueryString,
  parseCorpusFileContent,
} from "@/lib/queryIds";
import type { ClientComponent } from "@/types/next";

const ImportInput: ClientComponent = () => {
  const t = useTranslations("home.SearchSection.SearchInput.ImportInput");
  const { queryString, goToResultsPage } = useQueryContext();
  const idType = getIdTypeFromQueryString(queryString);
  const [idList, setIdList] = useState(
    getIdsFromQueryString(idType, queryString).join("\n"),
  );
  const [error, setError] = useState<CustomError | null>(null);
  const fileInputRef = useRef<ElementRef<"input">>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setError(null);
    setIdList(event.target.value);
  };

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    setError(null);

    const ids = idList.trim().split("\n");
    const firstId = ids[0];

    if (firstId === "") {
      setError(new CustomError({ name: "EmptyIdsError" }));
      return;
    }

    // The ID type of the whole list is based on the ID type of the first ID
    let newQueryString;
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

    goToResultsPage(newQueryString).catch(setError);
  };

  const handleCorpusFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file, "utf-8");

    reader.onload = (event) => {
      const corpusFileContent = event.target?.result?.toString();
      if (corpusFileContent == null) {
        return;
      }

      let parsingResult;
      try {
        parsingResult = parseCorpusFileContent(corpusFileContent);
      } catch (err) {
        if (err instanceof CustomError) {
          setError(err);
        }
        return;
      }

      goToResultsPage(parsingResult.queryString).catch(setError);
    };

    reader.onerror = () => {
      setError(new CustomError({ name: "FileReadError" }));
    };
  };

  return (
    <Box component="form" noValidate autoCorrect="off" onSubmit={handleSubmit}>
      <SearchTitle />

      <SearchBar>
        <MultilineTextField
          name="import-input"
          required
          autoFocus
          fullWidth
          maxRows={8}
          minRows={5}
          placeholder={t("placeholder")}
          error={error != null}
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
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                <Image src={SearchLogoUpload} alt={t("uploadIconAlt")} />
              </IconButton>
            ),
            sx: { alignItems: "flex-start" },
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
      </SearchBar>

      {error != null && <ErrorCard {...error.info} />}
    </Box>
  );
};

export default ImportInput;
