"use client";

import {
  type ChangeEventHandler,
  type FormEventHandler,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useSelectedLayoutSegment } from "next/navigation";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@/components/Button";
import MultilineTextField from "@/components/MultilineTextField";
import { examples } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import type CustomError from "@/lib/CustomError";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const RegularSearchInput: ClientComponent = () => {
  const t = useTranslations(
    "home.SearchSection.SearchInput.RegularSearchInput",
  );
  const tExamples = useTranslations("config.examples");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const urlSegment = useSelectedLayoutSegment();
  const searchParams = useSearchParams();
  const [queryString, setQueryString] = useState(useQueryContext().queryString);
  const [errorMessage, setErrorMessage] = useState("");
  const onHomePage = urlSegment == null;

  const goToResultsPage = (newQueryString: string) => {
    if (newQueryString.trim() === "") {
      setErrorMessage(tErrors("emptyQueryError"));
      return;
    }

    setQueryString(newQueryString);

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

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    goToResultsPage(queryString);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setErrorMessage("");
    setQueryString(event.target.value);
  };

  return (
    <Box component="form" noValidate autoCorrect="off" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h1" gutterBottom>
        {onHomePage ? t("searchTitle") : t("resultsTitle")}
      </Typography>

      <Box
        sx={{
          display: { xs: "block", sm: "flex" },
          textAlign: { xs: "center", sm: "inherit" },
          py: 2,
        }}
      >
        <MultilineTextField
          id="regular-search-input"
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

      {onHomePage && (
        <>
          <Typography variant="subtitle2" paragraph sx={{ mt: 2, mb: 1 }}>
            {t("examplesTitle")}
          </Typography>

          <Grid id="examples-grid" container rowSpacing={1} columnSpacing={2}>
            {Object.entries(examples).map(([name, _queryString]) => (
              <Grid key={name} item>
                <Button
                  mainColor="white"
                  secondaryColor="darkBlack"
                  variant="text"
                  size="small"
                  onClick={() => {
                    goToResultsPage(_queryString);
                  }}
                  sx={{ textTransform: "none" }}
                >
                  {tExamples(name)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default RegularSearchInput;
