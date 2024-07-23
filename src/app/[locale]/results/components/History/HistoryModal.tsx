import * as React from "react";
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
          {/* Current request */}
          <Typography component="h3" variant="h6" fontSize="1rem">
            {t("currentRequestTitle")}
          </Typography>
          <TableContainer sx={{ mb: 2 }}>
            <Table size="small">
              <TableBody>
                <HistoryItem
                  entry={history.getCurrentRequest()}
                  onClose={onClose}
                  isCurrentRequest
                />
              </TableBody>
            </Table>
          </TableContainer>

          {/* History */}
          <Typography component="h3" variant="h6" fontSize="1rem">
            {t("historyTitle")}
          </Typography>
          {!isHistoryEmpty ? (
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {history.get().map((entry, i) => (
                    <HistoryItem
                      key={entry.date}
                      entry={entry}
                      onClose={onClose}
                      index={i}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
