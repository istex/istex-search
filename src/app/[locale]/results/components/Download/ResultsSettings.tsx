import * as React from "react";
import { useTranslations } from "next-intl";
import WarningIcon from "@mui/icons-material/Warning";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import Sorting from "../Sorting";
import Button from "@/components/Button";
import NumberInput from "@/components/NumberInput";
import { istexApiConfig } from "@/config";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { usePathname, useRouter } from "@/i18n/routing";
import type SearchParams from "@/lib/SearchParams";
import {
  useDocumentCount,
  useMaxSize,
  useSearchParams,
  useSize,
} from "@/lib/hooks";
import { clamp, debounce } from "@/lib/utils";

export default function ResultsSettings() {
  const t = useTranslations("download.ResultsSettings");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const history = useHistoryContext();
  const isImportSearchMode = searchParams.getSearchMode() === "import";
  const documentCount = useDocumentCount();
  const maxSize = useMaxSize();
  const [size, setSize] = React.useState<number | null>(useSize());

  // eslint-disable-next-line react-compiler/react-compiler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateUrl = React.useCallback(
    // We debounce the URL update to avoid a roundtrip to the server on each change
    // and to make the input more reactive
    debounce((size: number, searchParams: SearchParams) => {
      searchParams.setSize(size);

      history.populateCurrentRequest({
        date: Date.now(),
        searchParams,
      });

      router.replace(`${pathname}?${searchParams.toString()}`, {
        scroll: false,
      });
    }, 350),
    [],
  );

  const updateSize = (size: number | null) => {
    setSize(size);
    updateUrl(size ?? 0, searchParams);
  };

  const handleChange = (newValue: number | null) => {
    if (newValue == null) {
      updateSize(newValue);
      return;
    }

    updateSize(clamp(newValue, 0, maxSize));
  };

  // If maxSize changed because we have selected documents and some of them were removed from the
  // SelectedDocPanel, we need to make sure our current size isn't greater than maxSize
  React.useEffect(() => {
    if (size != null && size > maxSize) {
      setSize(maxSize);
    }
  }, [size, maxSize]);

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
          id="size-input"
          size="small"
          min={1}
          max={maxSize}
          slotProps={{
            htmlInput: {
              "aria-labelledby": "size-input-label",
            },
          }}
          value={size}
          onChange={handleChange}
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
          onClick={() => {
            updateSize(maxSize);
          }}
          sx={{ ml: "auto" }}
        >
          {t("allButton")}
        </Button>
      </Box>
    </Stack>
  );
}
