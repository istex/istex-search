"use client";

import type { ChangeEventHandler } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import WarningIcon from "@mui/icons-material/Warning";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import { useDocumentContext } from "../Document/DocumentContext";
import Button from "@/components/Button";
import { istexApiConfig } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import useSearchParams from "@/lib/useSearchParams";
import { clamp } from "@/lib/utils";
import type { ClientComponent } from "@/types/next";

const ResultsSettings: ClientComponent = () => {
  const t = useTranslations("download.ResultsSettings");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { resultsCount } = useQueryContext();
  const { selectedDocuments, excludedDocuments } = useDocumentContext();

  const documentsCount =
    selectedDocuments.length > 0
      ? selectedDocuments.length
      : resultsCount - excludedDocuments.length;

  const maxSize = clamp(documentsCount, 0, istexApiConfig.maxSize);
  const size = clamp(searchParams.getSize(), 0, maxSize);

  const setSize = (size: number) => {
    searchParams.setSize(size);
    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = parseInt(event.target.value);
    if (isNaN(newValue)) {
      return;
    }

    setSize(clamp(newValue, 0, maxSize));
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
        {t("download")}
      </Box>
      <TextField
        id="size-input"
        type="number"
        size="small"
        inputProps={{
          min: 0,
          max: maxSize,
        }}
        value={size}
        onChange={handleChange}
      />
      <span>/&nbsp;{documentsCount.toLocaleString(locale)}</span>
      {documentsCount > maxSize && (
        <Tooltip
          title={t("warningTooltip", {
            resultsCount: documentsCount.toLocaleString(locale),
            maxSize: istexApiConfig.maxSize.toLocaleString(locale),
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
          setSize(maxSize);
        }}
        sx={{ ml: "auto" }}
      >
        {t("allButton")}
      </Button>
    </Box>
  );
};

export default ResultsSettings;
