"use client";

import {
  type ChangeEventHandler,
  type FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useSelectedLayoutSegment } from "next/navigation";
import { Box, Typography } from "@mui/material";
import Button from "@/components/Button";
import MultilineTextField from "@/components/MultilineTextField";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const RegularSearchInput: ClientComponent = () => {
  const t = useTranslations(
    "home.SearchSection.SearchInput.RegularSearchInput",
  );
  const router = useRouter();
  const urlSegment = useSelectedLayoutSegment();
  const searchParams = useSearchParams();
  const [queryString, setQueryString] = useState(searchParams.getQueryString());
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fullUri = `${urlSegment ?? ""}?${searchParams.toString()}`;

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();

    if (queryString.trim() === "") {
      setErrorMessage(t("emptyQueryError"));
      return;
    }

    searchParams.deleteSize();
    searchParams.deletePage();
    searchParams.setQueryString(queryString);

    router.push(`/results?${searchParams.toString()}`);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setErrorMessage("");
    setQueryString(event.target.value);
  };

  useEffect(() => {
    // When keyboard navigating, the focus doesn't reset when changing route,
    // when going to the next page for example. Which means we need to manually
    // set the focus on the input when the URI changes.
    inputRef.current?.focus();
  }, [fullUri]);

  return (
    <Box component="form" noValidate autoCorrect="off" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h1" gutterBottom>
        {urlSegment === "results" ? t("resultsTitle") : t("searchTitle")}
      </Typography>
      <Box
        sx={{
          display: { xs: "block", sm: "flex" },
          textAlign: { xs: "center", sm: "inherit" },
        }}
      >
        <MultilineTextField
          id="regular-search-input"
          inputRef={inputRef}
          placeholder={t("placeholder")}
          value={queryString}
          onChange={handleChange}
          onSubmit={handleSubmit}
          helperText={errorMessage}
          required
          autoFocus
          error={errorMessage !== ""}
          fullWidth
          minRows={1}
          maxRows={8}
          sx={{
            mb: { xs: 2, sm: 0 },
            // This targets the fieldset around the input
            "& .MuiOutlinedInput-notchedOutline": {
              borderTopRightRadius: { xs: 4, sm: 0 },
              borderBottomRightRadius: { xs: 4, sm: 0 },
            },
          }}
        />
        <Button
          type="submit"
          sx={{
            borderTopLeftRadius: { xs: 4, sm: 0 },
            borderBottomLeftRadius: { xs: 4, sm: 0 },
            height: "fit-content",
            py: 1.95,
            px: 1.75,
          }}
        >
          {t("button")}
        </Button>
      </Box>
    </Box>
  );
};

export default RegularSearchInput;
