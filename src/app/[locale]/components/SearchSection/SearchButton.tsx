import { useTranslations } from "next-intl";
import { Box, CircularProgress } from "@mui/material";
import Button from "@/components/Button";
import { useQueryContext } from "@/contexts/QueryContext";
import type { ClientComponent } from "@/types/next";

const SearchButton: ClientComponent<{ isAlone?: boolean }> = ({
  isAlone = false,
}) => {
  const t = useTranslations("home.SearchSection.SearchInput");
  const { loading } = useQueryContext();

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button
        type="submit"
        disabled={loading}
        sx={
          isAlone
            ? {
                px: 5,
                py: 2,
              }
            : {
                borderTopLeftRadius: { xs: 4, sm: 0 },
                borderBottomLeftRadius: { xs: 4, sm: 0 },
                height: "65px",
                py: 1.95,
                px: 1.75,
              }
        }
      >
        <span>{t("button")}</span>
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
      </Button>
    </Box>
  );
};

export default SearchButton;
