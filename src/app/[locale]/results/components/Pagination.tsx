"use client";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, IconButton, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useQueryContext } from "@/contexts/QueryContext";
import { usePagination } from "@/lib/hooks";
import { useRandomSeed } from "@/lib/searchParams";

export default function Pagination() {
  const t = useTranslations("results.Pagination");
  const { randomSeed } = useQueryContext();
  const { page, lastPage, setPage } = usePagination();
  const [, setRandomSeed] = useRandomSeed();
  const onFirstPage = page === 0;
  const onLastPage = page === lastPage;

  const changePage = (newPage: number) => {
    setRandomSeed(randomSeed ?? null);
    setPage(newPage, { shallow: false, history: "push" });
  };

  const goToPreivousPage = () => {
    changePage(page - 1);
  };

  const goToNextPage = () => {
    changePage(page + 1);
  };

  const goToFirstPage = () => {
    changePage(0);
  };

  const goToLastPage = () => {
    changePage(lastPage);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={(theme) => ({
        justifyContent: "space-between",
        borderTop: `1px solid ${theme.vars.palette.colors.veryLightBlack}`,
        borderBottom: `1px solid ${theme.vars.palette.colors.veryLightBlack}`,
        my: 7.5,
        color: theme.vars.palette.colors.lightBlack,
      })}
    >
      <Box>
        <IconButton
          color="inherit"
          disabled={onFirstPage}
          aria-label={t("firstPage")}
          title={t("firstPage")}
          onClick={goToFirstPage}
        >
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        <IconButton
          color="inherit"
          disabled={onFirstPage}
          aria-label={t("previousPage")}
          title={t("previousPage")}
          onClick={goToPreivousPage}
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
            backgroundColor: theme.vars.palette.colors.white,
            borderRadius: "5px",
            fontWeight: 700,
          })}
        >
          {t("currentPageIndex", { page: page + 1 })}
        </Box>
        <p>{t("on", { total: lastPage + 1 })}</p>
      </Stack>
      <Box>
        <IconButton
          color="inherit"
          disabled={onLastPage}
          aria-label={t("nextPage")}
          title={t("nextPage")}
          onClick={goToNextPage}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
        <IconButton
          color="inherit"
          disabled={onLastPage}
          aria-label={t("lastPage")}
          title={t("lastPage")}
          onClick={goToLastPage}
        >
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Box>
    </Stack>
  );
}
