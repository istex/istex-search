import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { useQueryContext } from "@/contexts/QueryContext";

interface SearchButtonProps {
  alone?: boolean;
}

export default function SearchButton({ alone = false }: SearchButtonProps) {
  const t = useTranslations("home.SearchSection");
  const { loading } = useQueryContext();

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button
        type="submit"
        disabled={loading}
        sx={
          !alone
            ? {
                borderTopLeftRadius: { sm: 0 },
                borderBottomLeftRadius: { sm: 0 },
                height: { sm: "65px" },
              }
            : undefined
        }
      >
        {t("button")}
      </Button>
    </Box>
  );
}
