"use client";

import {
  type ChangeEventHandler,
  type FormEventHandler,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { Box, TextField } from "@/mui/material";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

const ImportInput: ClientComponent = () => {
  const t = useTranslations("home.SearchSection.ImportInput");
  const [queryString, setQueryString] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (queryString.trim() === "") {
      setErrorMessage(t("emptyQueryError"));
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setErrorMessage("");
    setQueryString(event.target.value);
  };

  return (
    <Box
      component="form"
      noValidate
      autoCorrect="off"
      onSubmit={handleSubmit}
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
        multiline
        rows={8}
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
  );
};

export default ImportInput;
