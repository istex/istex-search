import { useTranslations } from "next-intl";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Transition,
  type DownloadModalProps,
} from "../results/Download/DownloadModal";
import Button from "@/components/Button";
import { mailtoLink } from "@/i18n/i18n";
import theme from "@/mui/theme";
import type { ClientComponent } from "@/types/next";

const HelpModal: ClientComponent<DownloadModalProps> = ({ open, onClose }) => {
  const t = useTranslations("help.modal");

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
            <Typography
              paragraph
              sx={{
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              {t("description")}
            </Typography>
            <Stack direction="row" gap={2} sx={{ my: 2, fontWeight: "bold" }}>
              <Button
                href="https://www.istex.fr/category/faq/"
                target="_blank"
                rel="noreferrer"
                sx={{ fontWeight: "bold" }}
              >
                {t("faq")}
              </Button>
              <Button
                href="https://doc.istex.fr/"
                target="_blank"
                rel="noreferrer"
                sx={{ fontWeight: "bold" }}
              >
                {t("documentation")}
              </Button>
              <Button
                href="https://istex-tutorial.data.istex.fr/"
                target="_blank"
                rel="noreferrer"
                sx={{ fontWeight: "bold" }}
              >
                {t("tutorials")}
              </Button>
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
              right: theme.spacing(1),
              top: theme.spacing(1),
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            {t.rich("message", { mailtoLink: mailtoLink("contact@istex.fr") })}
          </DialogContent>
        </Box>
      </Stack>
    </Dialog>
  );
};

export default HelpModal;
