import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box, Container, Grid2 as Grid, Typography } from "@mui/material";
import abesLogo from "@/../public/abes.svg";
import cnrsLogo from "@/../public/cnrs.svg";
import couperinLogo from "@/../public/couperin.svg";
import franceUniversitesLogo from "@/../public/france_universites.svg";
import investissementLogo from "@/../public/investissement.png";
import mesrLogo from "@/../public/mesr.svg";
import ulLogo from "@/../public/ul.svg";

const partners = [
  {
    logo: mesrLogo,
    alt: "Ministère de l'Enseignement Supérieur et de la Recherche",
    url: "https://www.enseignementsup-recherche.gouv.fr/",
  },
  {
    logo: cnrsLogo,
    alt: "Centre National de la Recherche Scientifique",
    url: "https://www.cnrs.fr/",
    width: 64, // The CNRS logo grows more than the others, so it needs to be in a smaller container
  },
  {
    logo: abesLogo,
    alt: "Agence Bibliographique de l'Enseignement Supérieur",
    url: "https://www.abes.fr/",
  },
  {
    logo: couperinLogo,
    alt: "Couperin",
    url: "https://www.couperin.org/",
  },
  {
    logo: franceUniversitesLogo,
    alt: "France Universités",
    url: "https://franceuniversites.fr/",
  },
  {
    logo: ulLogo,
    alt: "Université de Lorraine",
    url: "https://www.univ-lorraine.fr/",
  },
];

// This is used to calculate the flex-basis of each element
// Examples:
//   - 2 items per line           => MAX_ITEMS_PER_LINE / 2
//   - All items on the same line => MAX_ITEMS_PER_LINE / partners.length
const MAX_ITEMS_PER_LINE = 12;

export default function Footer() {
  const t = useTranslations("home.Footer");

  return (
    <Box
      component="footer"
      sx={{
        "&:before": {
          content: '""',
          display: "block",
          height: "0.5rem",
          width: "100%",
          background: "linear-gradient(to right, #458ca5 50%, #c4d733)",
        },
      }}
    >
      <Container sx={{ py: 3 }}>
        <Grid component="ul" container spacing={2}>
          {partners.map(({ logo, alt, url, width }) => (
            <Grid
              key={alt}
              component="li"
              size={{
                xs: MAX_ITEMS_PER_LINE / 2,
                md: MAX_ITEMS_PER_LINE / partners.length,
              }}
            >
              <Box
                sx={{
                  m: "auto",
                  position: "relative",
                  minHeight: 100,
                  maxWidth: width ?? 128,
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Image
                    src={logo}
                    alt={alt}
                    fill
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </a>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", py: 3 }}>
          <a
            href="https://anr.fr/ProjetIA-10-IDEX-0004"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={investissementLogo}
              alt="Programme Investissement d'Avenir"
            />
          </a>
          <Typography
            variant="body2"
            sx={{
              color: "colors.grey",
            }}
          >
            {t("funding")}: ANR-10-IDEX-0004-02
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
