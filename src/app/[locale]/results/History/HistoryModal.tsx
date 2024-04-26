"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  DialogActions,
  DialogContent,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import HistoryItem from "./HistoryItem";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useHistoryContext } from "@/contexts/HistoryContext";
import type { ClientComponent } from "@/types/next";

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
}

const HistoryModal: ClientComponent<HistoryModalProps> = ({
  open,
  onClose,
}) => {
  const t = useTranslations("results.History");
  const [confirmOpen, setConfirmOpen] = useState(false);
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
          <TableContainer>
            <Table size="small">
              <TableBody>
                <HistoryItem
                  entry={history.getCurrentRequest()}
                  onClose={onClose}
                  isCurrentRequest
                />

                {!isHistoryEmpty &&
                  history.get().map((entry, i) => (
                    <HistoryItem
                      key={entry.date}
                      entry={entry}
                      onClose={onClose}
                      index={i + 1} // +1 because of the last entry that is the first line
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {isHistoryEmpty && (
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
};

interface ConfirmModalProps extends HistoryModalProps {
  onConfirm: () => void;
}

const ConfirmModal: ClientComponent<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
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
};

export default HistoryModal;
