"use client";

import type { MouseEvent, ChangeEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { TablePagination } from "@mui/material";
import { type PerPageOption, istexApiConfig, perPageOptions } from "@/config";
import { useResultsContext } from "@/contexts/ResultsContext";
import useSearchParams from "@/lib/useSearchParams";
import { clamp } from "@/lib/utils";
import type { ClientComponent } from "@/types/next";

const Pagination: ClientComponent = () => {
  const t = useTranslations("results.Pagination");
  const locale = useLocale();
  const { resultsCount } = useResultsContext();
  const maxResults = clamp(resultsCount, 0, istexApiConfig.maxPaginationOffset);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const perPage = searchParams.getPerPage();
  const lastPage = Math.ceil(maxResults / perPage);
  const page = clamp(searchParams.getPage(), 1, lastPage);

  const handleChangePage = (
    _: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    searchParams.setPage(newPage + 1);
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    searchParams.setPage(1);
    searchParams.setPerPage(parseInt(event.target.value) as PerPageOption);
    router.replace(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <TablePagination
      component="div"
      count={maxResults}
      page={page - 1}
      onPageChange={handleChangePage}
      rowsPerPage={perPage}
      rowsPerPageOptions={perPageOptions as unknown as number[]}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelRowsPerPage={t("resultsPerPage")}
      labelDisplayedRows={({ page }) => (page + 1).toLocaleString(locale)}
      showFirstButton
      showLastButton
      SelectProps={{
        id: "pagination-select",
        labelId: "pagination-select-label",
        MenuProps: {
          MenuListProps: {
            dense: true,
          },
        },
      }}
      sx={(theme) => ({
        mb: 2,
        "& .MuiToolbar-root": {
          justifyContent: "center",
          p: 0,
        },
        // MUI uses a spacer element instead of 'justify-content: end' so we need to remove it
        // to center the TablePagination
        "& .MuiTablePagination-spacer": {
          display: "none",
        },
        "& .MuiTablePagination-input": {
          order: -1,
          ml: 0,
          mr: { xs: 1, sm: 2 },
        },
        "& .MuiTablePagination-selectLabel": {
          mr: { xs: 2.5, sm: 4 },
        },
        "& .MuiTablePagination-displayedRows": {
          px: 1,
          py: 0.5,
          borderLeft: `solid ${theme.palette.colors.grey} 1px`,
          borderRight: `solid ${theme.palette.colors.grey} 1px`,
        },
        "& .MuiToolbar-root > .MuiTablePagination-actions": {
          ml: { xs: 1.3, sm: 2.5 },
        },
      })}
    />
  );
};

export default Pagination;
