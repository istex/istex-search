import WarningIcon from "@mui/icons-material/Warning";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import NumberInput from "@/components/NumberInput";
import { istexApiConfig, SEARCH_MODE_IMPORT } from "@/config";
import { useDocumentCount, useMaxSize, useSize } from "@/lib/hooks";
import { useSearchMode } from "@/lib/searchParams";
import Sorting from "../Sorting";

export default function ResultsSettings() {
  const t = useTranslations("download.ResultsSettings");
  const isImportSearchMode = useSearchMode()[0] === SEARCH_MODE_IMPORT;
  const documentCount = useDocumentCount();
  const maxSize = useMaxSize();
  const [size, setSize] = useSize();

  const handleChange = (value: number | null) => {
    setSize(value);
  };

  const setSizeToMax = () => {
    setSize(maxSize);
  };

  return (
    <Stack spacing={1.875}>
      <Sorting
        fontSize="0.875rem"
        labelColor="colors.lightBlack"
        selectColor="colors.lightBlack"
        disabled={isImportSearchMode}
      />
      <Box
        sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}
      >
        <Box
          id="size-input-label"
          component="label"
          sx={{ display: { xs: "none", sm: "inline" } }}
        >
          {t("download")}
        </Box>
        <NumberInput
          size="small"
          min={1}
          max={maxSize}
          slotProps={{
            input: {
              "aria-labelledby": "size-input-label",
            },
          }}
          value={size}
          onValueChange={handleChange}
        />
        <span>/&nbsp;{t("resultCount", { count: documentCount })}</span>
        {documentCount > maxSize && (
          <Tooltip
            title={t("warningTooltip", {
              resultCount: documentCount,
              maxSize: istexApiConfig.maxSize,
            })}
            placement="top"
            arrow
            enterTouchDelay={1}
          >
            <IconButton size="small" color="warning" sx={{ p: 0 }}>
              <WarningIcon />
            </IconButton>
          </Tooltip>
        )}
        <Button
          id="all-button"
          variant="outlined"
          disabled={size === maxSize}
          onClick={setSizeToMax}
          sx={{ ml: "auto" }}
        >
          {t("allButton")}
        </Button>
      </Box>
    </Stack>
  );
}
