"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { usePathname, useRouter } from "@/i18n/navigation";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const PerPage: ClientComponent<{
  fontSize: string;
  labelColor: string;
  selectColor: string;
  enableLoading?: boolean;
}> = ({ fontSize, labelColor, selectColor, enableLoading }) => {
  const t = useTranslations("results.ResultsGrid");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const perPage = searchParams.getPerPage();
  const [selectMinWidth, setSelectMinWidth] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, [perPage]);

  const menuCallbackRef = useCallback(
    (menuDiv: HTMLDivElement | null) => {
      if (menuDiv !== null) {
        if (selectMinWidth === null || selectMinWidth !== menuDiv.clientWidth) {
          setSelectMinWidth(menuDiv.clientWidth);
        }
      }
    },
    [selectMinWidth],
  );
  const handlePerPageChange = (event: SelectChangeEvent<10 | 20 | 30>) => {
    searchParams.setPerPage(event.target.value as 10 | 20 | 30);
    if (enableLoading === true) {
      setLoading(true);
    }
    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="body2" sx={{ fontSize, color: labelColor }}>
        {t("PerPage")}
      </Typography>
      <Select
        autoWidth
        disabled={loading}
        variant="standard"
        value={perPage}
        onChange={handlePerPageChange}
        MenuProps={{
          keepMounted: true,
          slotProps: { paper: { ref: menuCallbackRef } },
        }}
        sx={{
          minWidth: selectMinWidth ?? "unset",
          fontSize,
          color: selectColor,
          fontWeight: 700,
          "&:before": {
            borderBottom: "none",
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottom: "none",
          },
          "&.Mui-disabled:before": {
            borderBottom: "none",
          },
          "&:after": {
            borderBottom: "none",
          },
          "& .MuiSelect-select:focus": {
            backgroundColor: "unset",
          },
        }}
      >
        <MenuItem value={10} sx={{ fontSize }}>
          10
        </MenuItem>
        <MenuItem value={20} sx={{ fontSize }}>
          20
        </MenuItem>
        <MenuItem value={30} sx={{ fontSize }}>
          30
        </MenuItem>
      </Select>
      {loading && <CircularProgress size={20} />}
    </Stack>
  );
};

export default PerPage;
