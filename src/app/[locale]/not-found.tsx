import { useTranslations } from "next-intl";
import { Container, Link, Typography } from "@mui/material";
import NextIntlLink from "@/i18n/next-intl-link";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        {t("title")}
      </Typography>
      <Typography>{t("body")}</Typography>
      <Typography>
        {t.rich("goBackLink", {
          link: (chunks) => (
            <Link component={NextIntlLink} href="/">
              {chunks}
            </Link>
          ),
        })}
      </Typography>
    </Container>
  );
}
