"use client";

import { useLocale, useTranslations } from "next-intl";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, IconButton, Stack } from "@mui/material";
import { istexApiConfig } from "@/config";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "@/lib/hooks";
import { clamp } from "@/lib/utils";
import { inter } from "@/mui/fonts";

export default function Pagination() {
  const locale = useLocale();
  const t = useTranslations("results.Pagination");
  const history = useHistoryContext();
  const { resultsCount, randomSeed } = useQueryContext();
  const maxResults = clamp(resultsCount, 0, istexApiConfig.maxPaginationOffset);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const perPage = searchParams.getPerPage();
  const lastPage = Math.ceil(maxResults / perPage);
  const page =
    resultsCount > 0 ? clamp(searchParams.getPage(), 1, lastPage) : 0;

  const handleChangePage = (newPage: number) => {
    searchParams.setPage(newPage);

    if (randomSeed != null) {
      searchParams.setRandomSeed(randomSeed);
    }

    history.populateCurrentRequest({
      date: Date.now(),
      searchParams,
    });

    router.push(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={(theme) => ({
        justifyContent: "space-between",
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
          disabled={page <= 1}
          aria-label={t("firstPage")}
          title={t("firstPage")}
          onClick={() => {
            handleChangePage(1);
          }}
        >
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        <IconButton
          color="inherit"
          disabled={page <= 1}
          aria-label={t("previousPage")}
          title={t("previousPage")}
          onClick={() => {
            handleChangePage(page - 1);
          }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
      </Box>
      <Stack
        direction="row"
        spacing="10px"
        sx={{
          alignItems: "center",
          fontSize: "12px",
        }}
      >
        <p>{t("page")}</p>
        <Box
          data-testid="pagination-page"
          sx={(theme) => ({
            px: "25px",
            py: "5px",
            backgroundColor: theme.palette.colors.white,
            borderRadius: "5px",
            fontWeight: 700,
          })}
        >
          {page.toLocaleString(locale)}
        </Box>
        <p>{t("on", { total: lastPage.toLocaleString(locale) })}</p>
      </Stack>
      <Box>
        <IconButton
          color="inherit"
          disabled={page >= lastPage}
          aria-label={t("nextPage")}
          title={t("nextPage")}
          onClick={() => {
            handleChangePage(page + 1);
          }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
        <IconButton
          color="inherit"
          disabled={page >= lastPage}
          aria-label={t("lastPage")}
          title={t("lastPage")}
          onClick={() => {
            handleChangePage(lastPage);
          }}
        >
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Box>
    </Stack>
  );
}
