import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import type { ModalProps } from "@/components/Modal";

export default function HelpModal({
  open,
  onClose,
}: Omit<ModalProps, "title" | "children">) {
  const t = useTranslations("help.modal");
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" scroll="body">
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
              sx={{
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              {t("description")}
            </Typography>
            <Stack
              direction="row"
              sx={{
                gap: 2,
                my: 2,
                fontWeight: "bold",
              }}
            >
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
                href="https://callisto-formation.fr/pluginfile.php/52002/mod_scorm/content/1/scormcontent/index.html"
                target="_blank"
                rel="noreferrer"
                sx={{ fontWeight: "bold" }}
              >
                {t("tutorial")}
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
            {t.rich("message", {
              externalLink: (chunks) => (
                <Link
                  href="https://www.istex.fr/contactez-nous/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {chunks}
                </Link>
              ),
            })}
          </DialogContent>
        </Box>
      </Stack>
    </Dialog>
  );
}
