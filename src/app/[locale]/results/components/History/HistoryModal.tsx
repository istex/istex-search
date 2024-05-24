import * as React from "react";
import { useTranslations } from "next-intl";
import { Box, DialogActions, DialogContent, Typography } from "@mui/material";
import HistoryItem from "./HistoryItem";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useHistoryContext } from "@/contexts/HistoryContext";

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HistoryModal({ open, onClose }: HistoryModalProps) {
  const t = useTranslations("results.History");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const history = useHistoryContext();
  const isHistoryEmpty = history.isEmpty();

  const openConfirmModal = () => {
    setConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmOpen(false);
  };

  const clearHistory = () => {
    history.clear();
  };

  return (
    <>
      <Modal
        title={t("title")}
        open={open}
        onClose={onClose}
        slideDirection="left"
      >
        <DialogContent>
          {/*
           * We use a grid layout and not an MUI table to make sure the column of the current request table
           * and history table stay aligned
           */}
          <Box
            display="grid"
            gridTemplateColumns="auto 1fr auto auto 0.5fr 0.5fr auto"
          >
            <Typography
              component="h3"
              variant="h6"
              fontSize="1rem"
              gridColumn="span 7"
            >
              {t("currentRequestTitle")}
            </Typography>
            <HistoryItem
              entry={history.getCurrentRequest()}
              onClose={onClose}
              isCurrentRequest
            />

            <Typography
              component="h3"
              variant="h6"
              fontSize="1rem"
              gridColumn="span 7"
              mt={1.5}
            >
              {t("historyTitle")}
            </Typography>
            {!isHistoryEmpty ? (
              history
                .get()
                .map((entry, i) => (
                  <HistoryItem
                    key={entry.date}
                    entry={entry}
                    onClose={onClose}
                    index={i}
                  />
                ))
            ) : (
              <Typography
                sx={(theme) => ({
                  color: theme.palette.text.disabled,
                  px: 2,
                  py: 1,
                })}
              >
                {t("emptyHistoryContent")}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            mainColor="red"
            disabled={isHistoryEmpty}
            onClick={openConfirmModal}
          >
            {t("clearHistory")}
          </Button>
        </DialogActions>
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onClose={closeConfirmModal}
        onConfirm={clearHistory}
      />
    </>
  );
}

interface ConfirmModalProps extends HistoryModalProps {
  onConfirm: () => void;
}

function ConfirmModal({ open, onClose, onConfirm }: ConfirmModalProps) {
  const t = useTranslations("results.History.ConfirmModal");

  const confirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal title={t("title")} open={open} onClose={onClose} fullWidth={false}>
      <DialogContent>{t("content")}</DialogContent>

      <DialogActions>
        <Button mainColor="red" onClick={confirm}>
          {t("confirm")}
        </Button>
      </DialogActions>
    </Modal>
  );
}
