import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box, Container, Typography } from "@mui/material";
import headerBackground from "@/../public/header-background.jpg";
import istexDlLogo from "@/../public/istex-dl.svg";
import Link from "@/i18n/next-intl-link";
import type { ServerComponent } from "@/types/next";

const Header: ServerComponent = () => {
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
        <Link href="/" id="home-link">
          <Image src={istexDlLogo} alt="Istex-DL" />
        </Link>
        <Typography
          color="white"
          component="h2"
          variant="subtitle1"
          sx={{
            fontSize: "0.875rem",
            lineHeight: 1.25,
          }}
        >
          {t.rich("baseline")}
        </Typography>
      </Container>
    </Box>
  );
};

export default Header;
