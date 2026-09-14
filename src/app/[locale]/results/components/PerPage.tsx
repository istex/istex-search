import {
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import * as React from "react";
import { type PerPageOption, perPageOptions } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import { usePagination } from "@/lib/hooks";

interface PerPageProps {
  fontSize: string;
  labelColor: string;
  selectColor: string;
}

export default function PerPage({
  fontSize,
  labelColor,
  selectColor,
}: PerPageProps) {
  const t = useTranslations("results");
  const { perPage, setPerPage } = usePagination();
  const { loading } = useQueryContext();
  const [selectMinWidth, setSelectMinWidth] = React.useState<number | null>(
    null,
  );

  const menuCallbackRef = React.useCallback(
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
    setPerPage(event.target.value, { shallow: false });
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
      }}
    >
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
        {perPageOptions.map((value) => (
          <MenuItem key={value} value={value} sx={{ fontSize }}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}
