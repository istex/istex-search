import { Box, Container, Link, Typography } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";
import notFoundImage from "@/../public/404.png";
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
        gap: 1,
        pb: 4,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        {t("title")}
      </Typography>

      <Box
        sx={{
          position: "relative",
          height: { xs: "10rem", sm: "20rem" },
        }}
      >
        <Image
          src={notFoundImage}
          alt=""
          fill
          priority
          style={{
            objectFit: "contain",
          }}
        />
      </Box>

      <section>
        <Typography>{t("body")}</Typography>
        <Box
          component="ul"
          sx={{
            listStyle: "unset",
            pl: 2.5,
          }}
        >
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <Box key={i} component="li" sx={{ py: 1 }}>
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
              </Box>
            ))}
        </Box>
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
