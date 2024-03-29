"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  type SelectChangeEvent,
  InputLabel,
} from "@mui/material";
import type { PerPageOption } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import { usePathname, useRouter } from "@/i18n/navigation";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

interface PerPageProps {
  fontSize: string;
  labelColor: string;
  selectColor: string;
}

const PerPage: ClientComponent<PerPageProps> = ({
  fontSize,
  labelColor,
  selectColor,
}) => {
  const t = useTranslations("results.ResultsGrid");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const perPage = searchParams.getPerPage();
  const { loading } = useQueryContext();
  const [selectMinWidth, setSelectMinWidth] = useState<number | null>(null);

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

  const handlePerPageChange = (event: SelectChangeEvent<PerPageOption>) => {
    searchParams.deletePage();
    searchParams.setPerPage(event.target.value as PerPageOption);
    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <InputLabel id="per-page-label" sx={{ fontSize, color: labelColor }}>
        {t("PerPage")}
      </InputLabel>
      <Select
        id="per-page-select"
        labelId="per-page-label"
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
      {loading === true && <CircularProgress size={20} />}
    </Stack>
  );
};

export default PerPage;
