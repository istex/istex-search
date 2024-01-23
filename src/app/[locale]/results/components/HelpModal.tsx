"use client";

import { useTranslations } from "next-intl";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { Transition, type DownloadModalProps } from "../Download/DownloadModal";
import Button from "@/components/Button";

const HelpModal = ({ open, onClose }: DownloadModalProps) => {
  const t = useTranslations("results.help");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="xl"
      scroll="body"
    >
      <Stack direction="row">
        <Box sx={{ bgcolor: "colors.white", p: 1.5 }}>
          <DialogTitle
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {t("title")}
          </DialogTitle>
          <DialogContent>
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              {t("description")}
            </p>
            <Stack direction="row" gap={2} sx={{ my: 2, fontWeight: "bold" }}>
              <a href="https://www.istex.fr/category/faq/" target="_blank">
                <Button sx={{ fontWeight: "bold" }}>{t("faq")}</Button>
              </a>
              <a href="https://doc.istex.fr/" target="_blank">
                <Button sx={{ fontWeight: "bold" }}>
                  {t("documentation")}
                </Button>
              </a>
              <a href="https://istex-tutorial.data.istex.fr/" target="_blank">
                <Button sx={{ fontWeight: "bold" }}>{t("tutorials")}</Button>
              </a>
            </Stack>
            {t("contact")}
          </DialogContent>
        </Box>
        <Box sx={{ p: 1.5 }}>
          <DialogTitle
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {t("contactTitle")}
          </DialogTitle>
          <IconButton
            data-testid="close-modal-button"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 15,
              top: 24,
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            {t("message")}
            <a href="mailto:contact@istex.fr">contact@istex.fr</a>
          </DialogContent>
        </Box>
      </Stack>
    </Dialog>
  );
};

export default HelpModal;
