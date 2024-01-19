import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import SearchButton from "./SearchButton";
import { useQueryContext } from "@/contexts/QueryContext";

const SearchBar = ({
  children,
  loading,
}: {
  children: React.ReactNode;
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

        <SearchButton loading={loading} />
      </Box>
    </Stack>
  );
};

export default SearchBar;
