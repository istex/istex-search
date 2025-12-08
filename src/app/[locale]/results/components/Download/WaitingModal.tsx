import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Box, DialogContent, Divider, Stack, Typography } from "@mui/material";
import Citation from "./Citation";
import zipIcon from "@/../public/zip.svg";
import Modal, { type ModalProps } from "@/components/Modal";
import { estimateArchiveSize } from "@/lib/formats";
import { useSearchParams, useSize } from "@/lib/hooks";
import { bytesToSize } from "@/lib/utils";

export default function WaitingModal({
  open,
  onClose,
}: Omit<ModalProps, "title" | "children">) {
  const t = useTranslations("download.WaitingModal");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const selectedFormats = searchParams.getFormats();
  const compressionLevel = searchParams.getCompressionLevel();
  const archiveType = searchParams.getArchiveType();
  const size = useSize();
  const archiveSize = estimateArchiveSize(
    selectedFormats,
    size,
    compressionLevel,
    archiveType,
  );

  return (
    <Modal title={t("title")} open={open} onClose={onClose} maxWidth="md">
      <DialogContent>
        <Stack spacing={2}>
          <Image
            src={zipIcon}
            alt=""
            width={100}
            height={100}
            style={{ margin: "auto" }}
          />

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
            }}
          >
            {t("approximately")}{" "}
            <Box
              component="span"
              style={{ fontSize: "1.2rem", fontWeight: "bold" }}
            >
              {bytesToSize(archiveSize, locale)}
            </Box>
          </Typography>

          <Typography>{t("closeModal")}</Typography>

          <Divider />

          <Citation />
        </Stack>
      </DialogContent>
    </Modal>
  );
}
