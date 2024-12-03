import { useTranslations } from "next-intl";
import { Container, Link, List, ListItem, Typography } from "@mui/material";
import RichText from "@/components/RichText";
import { SEARCH_MODE_ASSISTED } from "@/config";
import NextIntlLink from "@/i18n/next-intl-link";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        pb: 4,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        {t("title")}
      </Typography>

      <section>
        <Typography>{t("body")}</Typography>
        <List>
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <ListItem key={i} sx={{ display: "block" }}>
                <RichText>
                  {(tags) =>
                    t.rich(`list.${i}`, {
                      homeLink: (chunks) => (
                        <Link component={NextIntlLink} href="/">
                          {chunks}
                        </Link>
                      ),
                      assistedSearchLink: (chunks) => (
                        <Link
                          component={NextIntlLink}
                          href={{
                            pathname: "/",
                            query: { searchMode: SEARCH_MODE_ASSISTED },
                          }}
                        >
                          {chunks}
                        </Link>
                      ),
                      ...tags,
                    })
                  }
                </RichText>
              </ListItem>
            ))}
        </List>
      </section>

      <Typography>
        <RichText>
          {(tags) =>
            t.rich("contact", {
              link: (chunks) => (
                <Link
                  href="https://www.istex.fr/contactez-nous/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {chunks}
                </Link>
              ),
              ...tags,
            })
          }
        </RichText>
      </Typography>
    </Container>
  );
}
