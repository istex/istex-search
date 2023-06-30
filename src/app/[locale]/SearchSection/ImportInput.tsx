"use client";

import {
  useState,
  type FormEventHandler,
  type ChangeEventHandler,
} from "react";
import { Box, TextField } from "@/mui/material";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

export interface ImportInputLabels {
  placeholder: string;
  button: string;
  emptyQueryError: string;
}

const ImportSearchInput: ClientComponent<{ labels: ImportInputLabels }> = ({
  labels,
}) => {
  const [queryString, setQueryString] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (queryString.trim() === "") {
      setErrorMessage(labels.emptyQueryError);
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
        placeholder={labels.placeholder}
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
        mainColor="blue"
        secondaryColor="white"
        sx={{
          borderTopLeftRadius: { xs: 4, sm: 0 },
          borderBottomLeftRadius: { xs: 4, sm: 0 },
          height: "fit-content",
          py: 1.95,
          px: 1.75,
        }}
      >
        {labels.button}
      </Button>
    </Box>
  );
};

export default ImportSearchInput;
