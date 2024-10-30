import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box, Container, Stack, Typography } from "@mui/material";
import headerBackground from "@/../public/header-background.webp";
import istexSearchLogo from "@/../public/istex-search.svg";
import RichText from "@/components/RichText";
import Link from "@/i18n/next-intl-link";

export default function Header() {
  const t = useTranslations("home.Header");

  return (
    <Box
      component="header"
      sx={{
        backgroundImage: `url(${headerBackground.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container sx={{ py: 2, pt: 4 }}>
        <Stack
          id="home-link"
          direction="row"
          spacing={1}
          component={Link}
          href="/"
          sx={{
            mb: 1,
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <Image src={istexSearchLogo} alt="Istex Search" />
          <Typography
            component="div"
            variant="h3"
            sx={{
              color: "white",
              fontWeight: "normal",
            }}
          >
            Search
          </Typography>
        </Stack>
        <Typography
          component="h2"
          variant="subtitle1"
          sx={{
            color: "white",
            fontSize: "0.875rem",
            lineHeight: 1.25,
          }}
        >
          <RichText>{(tags) => t.rich("baseline", tags)}</RichText>
        </Typography>
      </Container>
    </Box>
  );
}
