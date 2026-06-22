import {
  Alert,
  AlertTitle,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import * as React from "react";
import Button from "@/components/Button";
import ErrorCard from "@/components/ErrorCard";
import type { ModalProps } from "@/components/Modal";
import Modal from "@/components/Modal";
import MultilineTextField from "@/components/MultilineTextField";
import RichText from "@/components/RichText";
import { useQueryContext } from "@/contexts/QueryContext";
import CustomError from "@/lib/CustomError";
import { useSearchParams } from "@/lib/hooks";
import { type ActionResult, getQueryStringFromPrompt } from "./actions";

export default function PromptModal({
  open,
  onClose,
}: Omit<ModalProps, "title" | "children">) {
  const t = useTranslations("home.SearchSection.PromptModal");
  const { goToResultsPage } = useQueryContext();
  const searchParams = useSearchParams();
  const defaultPrompt = searchParams.getPrompt();

  const getQueryStringFromPromptAction = async (
    _: unknown,
    formData: FormData,
  ): Promise<ActionResult> => {
    const newPrompt =
      formData.get("natural-search-input")?.toString().trim() ?? "";
    if (newPrompt === "") {
      return { success: false, errorInfo: { name: "EmptyPromptError" } };
    }

    const result = await getQueryStringFromPrompt(newPrompt);
    if (!result.success) {
      return result;
    }

    try {
      searchParams.setPrompt(newPrompt);
      await goToResultsPage(result.value, searchParams);
    } catch (error) {
      return {
        success: false,
        errorInfo:
          error instanceof CustomError ? error.info : { name: "default" },
      };
    }

    return result;
  };

  const [formState, formAction, isPending] = React.useActionState(
    getQueryStringFromPromptAction,
    null,
  );
  const isError = formState?.success === false;

  return (
    <Modal title={t("title")} open={open} onClose={onClose}>
      <form noValidate autoCorrect="off" action={formAction}>
        <DialogContent>
          <Typography gutterBottom>
            <RichText>{(tags) => t.rich("introduction", tags)}</RichText>
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>{t("noteTitle")}</AlertTitle>
            {t("note")}
          </Alert>

          <MultilineTextField
            name="natural-search-input"
            required
            autoFocus
            defaultValue={defaultPrompt}
            error={isError}
            fullWidth
            maxRows={8}
            minRows={1}
            placeholder={t("placeholder")}
          />

          {isError && <ErrorCard info={formState.errorInfo} sx={{ mt: 2 }} />}
        </DialogContent>

        <DialogActions>
          <Button type="submit" disabled={isPending}>
            {t("submitButton")}
          </Button>
        </DialogActions>
      </form>
    </Modal>
  );
}
