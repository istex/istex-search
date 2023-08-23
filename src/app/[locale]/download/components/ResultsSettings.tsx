"use client";

import type { ChangeEventHandler } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import WarningIcon from "@mui/icons-material/Warning";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import Button from "@/components/Button";
import { istexApiConfig } from "@/config";
import useSearchParams from "@/lib/useSearchParams";
import { clamp } from "@/lib/utils";
import type { ClientComponent } from "@/types/next";

const ResultsSettings: ClientComponent<{ actualSize: number }> = ({
  actualSize,
}) => {
  const t = useTranslations("download.ResultsSettings");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const maxSize = clamp(actualSize, 0, istexApiConfig.maxSize);
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
      <span data-testid="max-size-label">
        /&nbsp;{maxSize.toLocaleString()}
      </span>
      {actualSize > maxSize && (
        <Tooltip
          title={t("warningTooltip", {
            actualSize: actualSize.toLocaleString(),
            maxSize: istexApiConfig.maxSize.toLocaleString(),
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
        variant="outlined"
        sx={{ ml: "auto" }}
        onClick={() => {
          setSize(maxSize);
        }}
      >
        {t("allButton")}
      </Button>
    </Box>
  );
};

export default ResultsSettings;
