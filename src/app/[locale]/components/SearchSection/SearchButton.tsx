import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import Button from "@/components/Button";
import { useQueryContext } from "@/contexts/QueryContext";

interface SearchButtonProps {
  isAlone?: boolean;
}

export default function SearchButton({ isAlone = false }: SearchButtonProps) {
  const t = useTranslations("home.SearchSection");
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
        {t("button")}
      </Button>
    </Box>
  );
}
