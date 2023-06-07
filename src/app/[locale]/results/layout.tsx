import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import NextIntlLink from "@/i18n/next-intl-link";
import {
  Box,
  Container,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@/mui/material";
import { results } from "./results";
import type { GenerateMetadata, Layout } from "@/types/next";

export const generateMetadata: GenerateMetadata = async () => {
  const t = await getTranslations("results");

  return {
    title: `Istex-DL - ${t("ResultsLayout.title")}`,
  };
};

const ResultsLayout: Layout = ({ children }) => {
  const t = useTranslations("results");

  return (
    <Container component="main">
      <Typography variant="h3" py={3}>
        {t("ResultsLayout.title")}
      </Typography>
      <Box display="flex">
        <Box component="aside" pr={2}>
          <List
            disablePadding
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            {results.map((result) => (
              <ListItem key={result.id} disablePadding>
                <ListItemButton
                  href={`/results/${result.id}`}
                  LinkComponent={NextIntlLink}
                  sx={{
                    color: "colors.blue",
                    borderRadius: 1,
                    border: 1,
                    borderColor: "colors.blue",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "colors.blue",
                      color: "colors.white",
                    },
                  }}
                >
                  <ListItemText>{t(result.name)}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box width={0.3}>{children}</Box>
      </Box>
      <Link
        href="/"
        component={NextIntlLink}
        sx={{ display: "inline-block", paddingY: "1.5rem" }}
      >
        {t("ResultsLayout.goToHome")}
      </Link>
    </Container>
  );
};

export default ResultsLayout;
