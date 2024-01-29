"use client";

import { useLocale, useTranslations } from "next-intl";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, IconButton, Stack } from "@mui/material";
import { istexApiConfig } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import { usePathname, useRouter } from "@/i18n/navigation";
import useSearchParams from "@/lib/useSearchParams";
import { clamp } from "@/lib/utils";
import { inter } from "@/mui/fonts";
import type { ClientComponent } from "@/types/next";

const Pagination: ClientComponent = () => {
  const locale = useLocale();
  const t = useTranslations("results.Pagination");
  const { resultsCount } = useQueryContext();
  const maxResults = clamp(resultsCount, 0, istexApiConfig.maxPaginationOffset);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const perPage = searchParams.getPerPage();
  const lastPage = Math.ceil(maxResults / perPage);
  const page = clamp(searchParams.getPage(), 1, lastPage);

  const handleChangePage = (newPage: number) => {
    searchParams.setPage(newPage);
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      sx={(theme) => ({
        borderTop: `1px solid ${theme.palette.colors.veryLightBlack}`,
        borderBottom: `1px solid ${theme.palette.colors.veryLightBlack}`,
        my: 7.5,
        color: theme.palette.colors.lightBlack,
        fontFamily: inter.style.fontFamily,
      })}
    >
      <Box>
        <IconButton
          color="inherit"
          onClick={() => {
            handleChangePage(1);
          }}
          disabled={page === 1}
        >
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => {
            handleChangePage(page - 1);
          }}
          disabled={page === 1}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
      </Box>
      <Stack
        direction="row"
        spacing="10px"
        alignItems="center"
        sx={{
          fontSize: "12px",
        }}
      >
        <p>{t("page")}</p>
        <Box
          px="25px"
          py="5px"
          sx={(theme) => ({
            backgroundColor: theme.palette.colors.white,
            borderRadius: "5px",
            fontWeight: 700,
          })}
          data-testid="pagination-page"
        >
          {/* TODO: input here */}
          {page.toLocaleString(locale)}
        </Box>
        <p>{t("on", { total: lastPage.toLocaleString(locale) })}</p>
      </Stack>
      <Box>
        <IconButton
          color="inherit"
          onClick={() => {
            handleChangePage(page + 1);
          }}
          disabled={page === lastPage}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => {
            handleChangePage(lastPage);
          }}
          disabled={page === lastPage}
        >
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Box>
    </Stack>
  );
};

export default Pagination;
