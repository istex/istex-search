import { useTranslations } from "next-intl";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { Skeleton, Stack, Typography } from "@mui/material";
import AssistedSearchIcon from "@/../public/assisted-search.svg";
import SearchByIdIcon from "@/../public/id-search.svg";
import Button from "@/components/Button";
import {
  SEARCH_MODE_IMPORT,
  SEARCH_MODE_ASSISTED,
  SEARCH_MODE_REGULAR,
  searchModes,
  type SearchMode,
} from "@/config";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { useRouter } from "@/i18n/navigation";
import { useOnHomePage, useSearchParams } from "@/lib/hooks";

export default function SearchTitle() {
  const t = useTranslations("home.SearchSection");
  const searchParams = useSearchParams();
  const searchMode = searchParams.getSearchMode();
  const router = useRouter();
  const { resetSelectedExcludedDocuments } = useDocumentContext();
  const { resultsCount, loading } = useQueryContext();
  const onHomePage = useOnHomePage();

  const getTranslationKey = () => {
    let key;

    switch (searchMode) {
      case SEARCH_MODE_REGULAR:
        key = "RegularSearchInput";
        break;
      case SEARCH_MODE_ASSISTED:
        key = "AssistedSearchInput";
        break;
      case SEARCH_MODE_IMPORT:
        key = "ImportInput";
        break;
      default:
        throw new Error("Unknown search mode");
    }

    if (onHomePage) {
      key += ".searchTitle";
    } else {
      key += ".resultsTitle";
    }

    return key;
  };

  const goToHomePage = (searchMode: SearchMode) => {
    searchParams.clear();
    searchParams.setSearchMode(searchMode);
    resetSelectedExcludedDocuments();
    router.push(`/?${searchParams.toString()}`);
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" component="h1" gutterBottom>
          {t(getTranslationKey())}
        </Typography>
        <Stack direction="row" spacing={1}>
          {searchModes.map((mode) => (
            <Button
              key={mode}
              mainColor="lightBlue"
              variant="contained"
              sx={(theme) => ({
                color: theme.palette.primary.main,
                bgColor: theme.palette.colors.lightBlue,
                border:
                  mode === searchMode
                    ? `1px solid ${theme.palette.primary.main}`
                    : "",
                boxShadow:
                  mode === searchMode ? "0px 3px 3px 0px rgba(0,0,0,0.25)" : "",
                minWidth: "40px",
                maxWidth: "40px",
                height: "40px",
              })}
              title={t(`${mode}Mode`)}
              onClick={() => {
                goToHomePage(mode);
              }}
              data-testid={`${mode}-search-button`}
            >
              <Icon searchMode={mode} />
            </Button>
          ))}
        </Stack>
      </Stack>

      {/* Results count */}
      {!onHomePage ? (
        loading === true ? (
          <Skeleton variant="text" sx={{ fontSize: "0.6875rem" }} width={130} />
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.6875rem",
              color: "colors.grey",
            }}
          >
            {t.rich("resultsCount", {
              resultsSpan: (chunks) => (
                <Typography
                  component="span"
                  sx={{
                    fontSize: "inherit",
                    color: "colors.darkBlack",
                    fontWeight: 700,
                  }}
                >
                  {chunks}
                </Typography>
              ),
              count: resultsCount,
            })}
          </Typography>
        )
      ) : null}
    </>
  );
}

interface IconProps {
  searchMode: SearchMode;
}

function Icon({ searchMode }: IconProps) {
  const t = useTranslations("home.SearchSection");
  const altText = t(`${searchMode}Mode`);

  switch (searchMode) {
    case SEARCH_MODE_REGULAR:
      return <SearchIcon sx={{ p: 0 }} titleAccess={altText} />;
    case SEARCH_MODE_ASSISTED:
      return <Image src={AssistedSearchIcon} alt={altText} />;
    case SEARCH_MODE_IMPORT:
      return <Image src={SearchByIdIcon} alt={altText} />;
    default:
      throw new Error("Unknown search mode");
  }
}
