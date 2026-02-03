import SearchIcon from "@mui/icons-material/Search";
import {
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";
import Image from "next/image";
import { useTranslations } from "next-intl";
import AssistedSearchIcon from "@/../public/assisted-search.svg";
import SearchByIdIcon from "@/../public/id-search.svg";
import {
  SEARCH_MODE_ASSISTED,
  SEARCH_MODE_IMPORT,
  SEARCH_MODE_REGULAR,
  type SearchMode,
  searchModes,
} from "@/config";
import { resetSelectedExcludedDocuments } from "@/contexts/DocumentContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { useRouter } from "@/i18n/routing";
import { useOnHomePage, useSearchParams } from "@/lib/hooks";

export default function SearchTitle() {
  const t = useTranslations("home.SearchSection");
  const searchParams = useSearchParams();
  const searchMode = searchParams.getSearchMode();
  const router = useRouter();
  const { results, loading } = useQueryContext();
  const onHomePage = useOnHomePage();

  const getTranslationKey = () => {
    let key: string;

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

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newSearchMode: SearchMode | null,
  ) => {
    if (newSearchMode != null) {
      goToHomePage(newSearchMode);
    }
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
        }}
      >
        {/* Title */}
        <Typography variant="h5" component="h1" gutterBottom>
          {t(getTranslationKey())}
        </Typography>

        {/* Search mode buttons */}
        <StyledToggleButtonGroup
          size="small"
          exclusive
          aria-label={t("searchModeGroupAriaLabel")}
          value={searchMode}
          onChange={handleChange}
        >
          {searchModes.map((mode) => (
            <StyledToggleButton
              key={mode}
              value={mode}
              title={t(`${mode}Mode`)}
              aria-label={t(`${mode}Mode`)}
            >
              <Icon searchMode={mode} />
            </StyledToggleButton>
          ))}
        </StyledToggleButtonGroup>
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
            {t.rich("resultCount", {
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
              count: results.total,
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

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.vars.shape.borderRadius,
    width: 40,
    height: 40,
    backgroundColor: theme.vars.palette.colors.lightBlue,
    color: theme.vars.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.vars.palette.colors.lightBlue,
    },
  },
  [`& .${toggleButtonGroupClasses.lastButton}`]: {
    marginRight: 0,
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  [`&.${toggleButtonClasses.selected}`]: {
    backgroundColor: theme.vars.palette.colors.lightBlue,
    color: theme.vars.palette.primary.main,
    border: `solid 1px ${theme.vars.palette.primary.main} !important`,
    boxShadow: "0px 3px 3px 0px rgba(0,0,0,0.25)",
    "&:hover": {
      backgroundColor: theme.vars.palette.colors.lightBlue,
    },
  },
}));
