import { useTranslations } from "next-intl";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import SearchButton from "./SearchButton";
import { useQueryContext } from "@/contexts/QueryContext";
import { useOnHomePage } from "@/lib/hooks";
import type { ClientComponent } from "@/types/next";

const SearchBar: ClientComponent<{}, true> = ({ children }) => {
  const t = useTranslations("home.SearchSection.SearchInput");
  const onHomePage = useOnHomePage();
  const { resultsCount, loading } = useQueryContext();

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

        <SearchButton />
      </Box>
    </Stack>
  );
};

export default SearchBar;
