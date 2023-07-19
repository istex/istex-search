"use client";

import {
  type ChangeEventHandler,
  type FormEventHandler,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useSelectedLayoutSegment } from "next/navigation";
import { Box, TextField, Typography } from "@mui/material";
import Button from "@/components/Button";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const RegularSearchInput: ClientComponent = () => {
  const t = useTranslations(
    "home.SearchSection.SearchInput.RegularSearchInput"
  );
  const router = useRouter();
  const urlSegment = useSelectedLayoutSegment();
  const searchParams = useSearchParams();
  const [queryString, setQueryString] = useState(searchParams.getQueryString());
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (queryString.trim() === "") {
      setErrorMessage(t("emptyQueryError"));
      return;
    }

    searchParams.setQueryString(queryString);

    router.push(`/results?${searchParams.toString()}`);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setErrorMessage("");
    setQueryString(event.target.value);
  };

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
        <TextField
          placeholder={t("placeholder")}
          value={queryString}
          onChange={handleChange}
          helperText={errorMessage}
          required
          autoFocus
          error={errorMessage !== ""}
          fullWidth
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
