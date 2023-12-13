import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box } from "@mui/material";
import SearchLogoSelected from "@/../public/id-search-selected.svg";
import SearchLogoUnselected from "@/../public/id-search-unselected.svg";
import Button from "@/components/Button";

const SearchBar = ({
  children,
  isSearchById,
  switchSearchMode,
}: {
  children: React.ReactNode;
  isSearchById: boolean;
  switchSearchMode: () => void;
}) => {
  const t = useTranslations("home.SearchSection.SearchInput");
  return (
    <Box
      sx={{
        display: { xs: "block", sm: "flex" },
        textAlign: { xs: "center", sm: "inherit" },
      }}
    >
      {children}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="submit"
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
          onClick={switchSearchMode}
          data-testid="search-by-id-button"
        >
          <Image
            src={isSearchById ? SearchLogoSelected : SearchLogoUnselected}
            alt="Search-by-Id"
          />
          {t("importButton")}
        </Button>
      </Box>
    </Box>
  );
};

export default SearchBar;
