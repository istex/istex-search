import { useTranslations } from "next-intl";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { Stack, Typography } from "@mui/material";
import { useDocumentContext } from "../../results/Document/DocumentContext";
import AssistedSearchIcon from "@/../public/assisted-search.svg";
import SearchByIdIcon from "@/../public/id-search.svg";
import Button from "@/components/Button";
import {
  SEARCH_MODE_ADVANCED,
  SEARCH_MODE_ASSISTED,
  SEARCH_MODE_REGULAR,
  type SearchMode,
} from "@/config";
import { useRouter } from "@/i18n/navigation";
import useSearchParams from "@/lib/useSearchParams";

const SearchTitle = ({ title }: { title: string }) => {
  const t = useTranslations("home.SearchSection");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetSelectedExcludedDocuments } = useDocumentContext();

  const goToHomePage = (searchMode: SearchMode) => {
    searchParams.clear();
    searchParams.setSearchMode(searchMode);
    resetSelectedExcludedDocuments();
    router.push(`/?${searchParams.toString()}`);
  };

  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="h5" component="h1" gutterBottom>
        {title}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button
          mainColor="lightBlue"
          variant="contained"
          sx={(theme) => ({
            color: theme.palette.primary.main,
            bgColor: theme.palette.colors.lightBlue,
            border: searchParams.isSearchModeRegular()
              ? `1px solid ${theme.palette.primary.main}`
              : "",
            boxShadow: searchParams.isSearchModeRegular()
              ? "0px 3px 3px 0px rgba(0,0,0,0.25)"
              : "",
            minWidth: "40px",
            maxWidth: "40px",
            height: "40px",
          })}
          title={t("regularButton")}
          onClick={() => {
            goToHomePage(SEARCH_MODE_REGULAR);
          }}
          data-testid="regular-search-button"
        >
          <SearchIcon sx={{ p: 0 }} />
        </Button>
        <Button
          mainColor="lightBlue"
          variant="contained"
          sx={(theme) => ({
            bgColor: theme.palette.colors.lightBlue,
            border: searchParams.isSearchModeAssisted()
              ? `1px solid ${theme.palette.primary.main}`
              : "",
            boxShadow: searchParams.isSearchModeAssisted()
              ? "0px 3px 3px 0px rgba(0,0,0,0.25)"
              : "",
            minWidth: "40px",
            maxWidth: "40px",
            height: "40px",
          })}
          title={t("assistedButton")}
          onClick={() => {
            goToHomePage(SEARCH_MODE_ASSISTED);
          }}
          data-testid="assisted-search-button"
        >
          <Image src={AssistedSearchIcon} alt="Assisted-search" />
        </Button>
        <Button
          mainColor="lightBlue"
          variant="contained"
          sx={(theme) => ({
            bgColor: theme.palette.colors.lightBlue,
            border: searchParams.isSearchModeAdvanced()
              ? `1px solid ${theme.palette.primary.main}`
              : "",
            boxShadow: searchParams.isSearchModeAdvanced()
              ? "0px 3px 3px 0px rgba(0,0,0,0.25)"
              : "",
            minWidth: "40px",
            maxWidth: "40px",
            height: "40px",
          })}
          title={t("advancedButton")}
          onClick={() => {
            goToHomePage(SEARCH_MODE_ADVANCED);
          }}
          data-testid="advanced-search-button"
        >
          <Image src={SearchByIdIcon} alt="Advanced-search" />
        </Button>
      </Stack>
    </Stack>
  );
};

export default SearchTitle;
