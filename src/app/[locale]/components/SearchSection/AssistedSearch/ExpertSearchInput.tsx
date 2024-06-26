import * as React from "react";
import { useTranslations } from "next-intl";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
} from "@mui/material";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import MultilineTextField from "@/components/MultilineTextField";

interface ExpertSearchInputProps {
  queryString: string;
  setQueryString: (queryString: string) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  onSubmit: React.FormEventHandler;
  hide: () => void;
}

export default function ExpertSearchInput({
  queryString,
  setQueryString,
  errorMessage,
  setErrorMessage,
  modalOpen,
  setModalOpen,
  onSubmit,
  hide,
}: ExpertSearchInputProps) {
  const t = useTranslations(
    "home.SearchSection.AssistedSearchInput.ExpertSearchInput",
  );
  const tRegular = useTranslations("home.SearchSection.RegularSearchInput");

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setErrorMessage("");
    setQueryString(event.target.value);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Stack spacing={2} direction="row">
        <MultilineTextField
          id="expert-search-input"
          onChange={handleChange}
          onSubmit={onSubmit}
          helperText={errorMessage}
          required
          autoFocus
          error={errorMessage !== ""}
          fullWidth
          maxRows={8}
          minRows={1}
          placeholder={tRegular("placeholder")}
          value={queryString}
        />

        <Box>
          <IconButton
            data-testid="go-back-button"
            color="primary"
            aria-label={t("goBackButton")}
            title={t("goBackButton")}
            onClick={hide}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Stack>

      <Box sx={{ textAlign: "center" }}>
        <Button type="submit" onClick={onSubmit}>
          {t("validate")}
        </Button>
      </Box>

      <Modal title={t("Dialog.title")} open={modalOpen} onClose={closeModal}>
        <DialogContent>{t("Dialog.content")}</DialogContent>

        <DialogActions sx={{ pt: 0 }}>
          <Button onClick={onSubmit} autoFocus>
            {t("Dialog.confirm")}
          </Button>
        </DialogActions>
      </Modal>
    </>
  );
}
