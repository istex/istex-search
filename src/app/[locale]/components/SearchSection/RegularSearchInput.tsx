"use client";

import {
  useState,
  type FormEventHandler,
  type ChangeEventHandler,
} from "react";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { useRouter } from "next-intl/client";
import { Box, TextField, Typography } from "@/mui/material";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

export interface RegularSearchInputLabels {
  searchTitle: string;
  resultsTitle: string;
  placeholder: string;
  button: string;
  emptyQueryError: string;
}

const RegularSearchInput: ClientComponent<{
  labels: RegularSearchInputLabels;
}> = ({ labels }) => {
  const router = useRouter();
  const urlSegment = useSelectedLayoutSegment();
  const searchParams = useSearchParams();
  const [queryString, setQueryString] = useState(searchParams.get("q") ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (queryString.trim() === "") {
      setErrorMessage(labels.emptyQueryError);
      return;
    }

    router.push(
      `/results?${new URLSearchParams({ q: queryString }).toString()}`
    );
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setErrorMessage("");
    setQueryString(event.target.value);
  };

  return (
    <Box component="form" noValidate autoCorrect="off" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h1" gutterBottom>
        {urlSegment === "results" ? labels.resultsTitle : labels.searchTitle}
      </Typography>
      <Box
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
    </Box>
  );
};

export default RegularSearchInput;
