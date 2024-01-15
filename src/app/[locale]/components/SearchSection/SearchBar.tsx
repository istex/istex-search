import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import Image from "next/image";
import {
  Box,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AssistedSearchIcon from "@/../public/assisted-search.svg";
import SearchByIdSelectedIcon from "@/../public/id-search-selected.svg";
import SearchByIdUnselectedIcon from "@/../public/id-search-unselected.svg";
import Button from "@/components/Button";
import { useQueryContext } from "@/contexts/QueryContext";

const SearchBar = ({
  children,
  switchAssistedSearch,
  isSearchById,
  switchSearchById,
  loading,
}: {
  children: React.ReactNode;
  switchAssistedSearch: () => void;
  isSearchById: boolean;
  switchSearchById: () => void;
  loading?: boolean;
}) => {
  const t = useTranslations("home.SearchSection.SearchInput");
  const onHomePage = usePathname() === "/";
  const { resultsCount } = useQueryContext();
  return (
    <Stack spacing={1}>
      {loading === true ? (
        <Skeleton variant="text" sx={{ fontSize: "0.6875rem" }} width={130} />
      ) : (
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.6875rem",
            color: "colors.grey",
          }}
        >
          {!onHomePage &&
            t.rich("resultsCount", {
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
      )}
      <Box
        sx={{
          display: { xs: "block", sm: "flex" },
          textAlign: { xs: "center", sm: "inherit" },
        }}
      >
        {children}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ position: "relative" }}>
            <Button
              type="submit"
              disabled={loading}
              sx={{
                borderTopLeftRadius: { xs: 4, sm: 0 },
                borderBottomLeftRadius: { xs: 4, sm: 0 },
                height: "65px",
                py: 1.95,
                px: 1.75,
              }}
            >
              {t("button")}
            </Button>
            {loading === true && (
              <CircularProgress
                size={24}
                sx={{
                  color: "colors.blue",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
          <Button
            mainColor={isSearchById ? undefined : "white"}
            secondaryColor="darkBlack"
            variant="text"
            size="small"
            sx={{
              height: "65px",
              borderRadius: "5px",
              width: "85px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              fontSize: "0.4rem",
              lineHeight: "0.5rem",
              ml: 1,
              gap: 1,
              color: isSearchById ? "white" : "black",
            }}
            onClick={switchSearchById}
            data-testid="search-by-id-button"
          >
            <Image
              src={
                isSearchById ? SearchByIdSelectedIcon : SearchByIdUnselectedIcon
              }
              alt="Search-by-Id"
            />
            {t("importButton")}
          </Button>
          <Button
            mainColor="white"
            secondaryColor="darkBlack"
            variant="text"
            size="small"
            sx={{
              height: "65px",
              borderRadius: "5px",
              width: "85px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              fontSize: "0.4rem",
              lineHeight: "0.5rem",
              ml: 1,
              gap: 1,
            }}
            onClick={switchAssistedSearch}
            data-testid="assist-search-button"
          >
            <Image src={AssistedSearchIcon} alt="Assisted-search" />
            {t("assistedButton")}
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default SearchBar;
