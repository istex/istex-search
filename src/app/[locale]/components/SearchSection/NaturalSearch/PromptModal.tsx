import {
  Alert,
  AlertTitle,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import * as React from "react";
import Button from "@/components/Button";
import ErrorCard from "@/components/ErrorCard";
import type { ModalProps } from "@/components/Modal";
import Modal from "@/components/Modal";
import MultilineTextField from "@/components/MultilineTextField";
import Panel from "@/components/Panel";
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
  const [prompt, setPrompt] = React.useState(defaultPrompt);

  const getQueryStringFromPromptAction = async (): Promise<ActionResult> => {
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt === "") {
      return { success: false, errorInfo: { name: "EmptyPromptError" } };
    }

    const result = await getQueryStringFromPrompt(trimmedPrompt);
    if (!result.success) {
      return result;
    }

    try {
      searchParams.setPrompt(trimmedPrompt);
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

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setPrompt(event.target.value);
  };

  return (
    <Modal title={t("title")} open={open} onClose={onClose}>
      <form noValidate autoCorrect="off" action={formAction}>
        <DialogContent>
          <Panel>
            <Stack spacing={2}>
              <Typography>
                <RichText>{(tags) => t.rich("introduction", tags)}</RichText>
              </Typography>

              <MultilineTextField
                name="natural-search-input"
                required
                autoFocus
                error={isError}
                fullWidth
                maxRows={8}
                minRows={1}
                placeholder={t("placeholder")}
                value={prompt}
                onChange={handleChange}
              />

              {isError && <ErrorCard info={formState.errorInfo} />}

              <Alert severity="info">
                <AlertTitle>{t("noteTitle")}</AlertTitle>
                {t("note")}
              </Alert>
            </Stack>
          </Panel>
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
