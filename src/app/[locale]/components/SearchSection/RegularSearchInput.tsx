import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box, IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import * as React from "react";
import ErrorCard from "@/components/ErrorCard";
import MultilineTextField from "@/components/MultilineTextField";
import { useQueryContext } from "@/contexts/QueryContext";
import CustomError from "@/lib/CustomError";
import { useOnHomePage } from "@/lib/hooks";
import ExampleList from "./ExampleList";
import PromptModal from "./NaturalSearch/PromptModal";
import SearchButton from "./SearchButton";
import SearchTitle from "./SearchTitle";

export default function RegularSearchInput() {
  const t = useTranslations("home.SearchSection.RegularSearchInput");
  const queryContext = useQueryContext();
  const [queryString, setQueryString] = React.useState(
    queryContext.queryString,
  );
  const [error, setError] = React.useState<CustomError | null>(
    queryContext.errorInfo != null
      ? new CustomError(queryContext.errorInfo)
      : null,
  );
  const [promptModalOpen, setPromptModalOpen] = React.useState(false);
  const { goToResultsPage } = useQueryContext();
  const onHomePage = useOnHomePage();

  const handleSubmit = async () => {
    const trimmedQueryString = queryString.trim();
    if (trimmedQueryString === "") {
      setError(new CustomError({ name: "EmptyQueryError" }));
      return;
    }

    try {
      await goToResultsPage(trimmedQueryString);
    } catch (error) {
      if (error instanceof CustomError) {
        setError(error);
      }
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setError(null);
    setQueryString(event.target.value);
  };

  const openPromptModal = () => {
    setPromptModalOpen(true);
  };

  const closePromptModal = () => {
    setPromptModalOpen(false);
  };

  return (
    <>
      <form noValidate autoCorrect="off" action={handleSubmit}>
        <SearchTitle />

        <Box
          sx={{
            mt: 1,
            display: { xs: "block", sm: "flex" },
          }}
        >
          <MultilineTextField
            name="regular-search-input"
            required
            autoFocus
            error={error != null}
            fullWidth
            maxRows={8}
            minRows={1}
            placeholder={t("placeholder")}
            value={queryString}
            onChange={handleChange}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    size="small"
                    title={t("promptButtonAriaLabel")}
                    aria-label={t("promptButtonAriaLabel")}
                    onClick={openPromptModal}
                    sx={{ p: 0.5, alignSelf: "start" }}
                  >
                    <AutoAwesomeIcon color="primary" />
                  </IconButton>
                ),
              },
              htmlInput: {
                style: {
                  minHeight: "32px",
                  lineHeight: "32px",
                },
              },
            }}
            sx={{
              mb: { xs: 2, sm: 0 },
              // This targets the fieldset around the input
              "& .MuiOutlinedInput-notchedOutline": {
                borderTopRightRadius: { xs: 4, sm: 0 },
                borderBottomRightRadius: { xs: 4, sm: 0 },
              },
            }}
          />

          <SearchButton />
        </Box>

        {error != null && <ErrorCard info={error.info} sx={{ mt: 2 }} />}

        {onHomePage && <ExampleList setError={setError} />}
      </form>

      {/* We unmount the modal when closed so that its internal form error state can be reset */}
      {promptModalOpen && (
        <PromptModal open={promptModalOpen} onClose={closePromptModal} />
      )}
    </>
  );
}
