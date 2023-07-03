"use client";

import {
  useState,
  type FormEventHandler,
  type ChangeEventHandler,
} from "react";
import { useRouter } from "next-intl/client";
import { Box, TextField } from "@/mui/material";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

export interface RegularSearchInputLabels {
  placeholder: string;
  button: string;
  emptyQueryError: string;
}

const RegularSearchInput: ClientComponent<{
  labels: RegularSearchInputLabels;
}> = ({ labels }) => {
  const [queryString, setQueryString] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (queryString.trim() === "") {
      setErrorMessage(labels.emptyQueryError);
      return;
    }

    const searchParams = new URLSearchParams({ q: queryString });

    router.push(`/results?${searchParams.toString()}`);
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

export default RegularSearchInput;
