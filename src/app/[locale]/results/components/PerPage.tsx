import * as React from "react";
import { useTranslations } from "next-intl";
import {
  InputLabel,
  MenuItem,
  Select,
  Stack,
  type SelectChangeEvent,
} from "@mui/material";
import { perPageOptions, type PerPageOption } from "@/config";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "@/lib/hooks";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const history = useHistoryContext();
  const perPage = searchParams.getPerPage();
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
    searchParams.deletePage();
    searchParams.setPerPage(event.target.value as PerPageOption);

    history.populateCurrentRequest({
      date: Date.now(),
      searchParams,
    });

    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
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
