import Image from "next/image";
import { Box, Container, Stack } from "@mui/material";
import abesLogo from "@/../public/abes.svg";
import cnrsLogo from "@/../public/cnrs.svg";
import couperinLogo from "@/../public/couperin.svg";
import franceUniversitesLogo from "@/../public/france_universites.svg";
import inriaLogo from "@/../public/inria.svg";
import opereInistLogo from "@/../public/opere-par-inist.svg";
import ulLogo from "@/../public/ul.svg";

const partners = [
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
  {
    logo: inriaLogo,
    alt: "Institut national de recherche en sciences et technologies du numérique",
    url: "https://www.inria.fr/",
  },
];

export default function Footer() {
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
        <Stack
          component="ul"
          direction="row"
          columnGap={4}
          useFlexGap
          sx={{ justifyContent: "center", flexWrap: "wrap" }}
        >
          {partners.map(({ logo, alt, url, width }) => (
            <Box
              key={alt}
              component="li"
              sx={{
                minHeight: 100,
                minWidth: width ?? 128,
              }}
            >
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                style={{
                  position: "relative",
                  display: "block",
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
          ))}
        </Stack>

        <Box
          sx={{
            m: "auto",
            position: "relative",
            minHeight: 100,
            maxWidth: 120,
          }}
        >
          <a
            href="https://inist.fr/"
            target="_blank"
            rel="noreferrer"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <Image src={opereInistLogo} alt="Opéré par l'Inist-CNRS" fill />
          </a>
        </Box>
      </Container>
    </Box>
  );
}
