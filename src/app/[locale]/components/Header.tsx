import { useTranslations } from "next-intl";
import Image from "next/image";
import { DownloadIcon } from "@/mui/icons-material";
import { Avatar, Box, Container, Typography } from "@/mui/material";
import headerBackground from "@/../public/header-background.jpg";
import istexDlLogo from "@/../public/istex-dl.svg";
import type { ServerComponent } from "@/types/next";

const icons = [
  {
    component: DownloadIcon,
    title: "icons.0",
  },
  {
    component: DownloadIcon,
    title: "icons.1",
  },
  {
    component: DownloadIcon,
    title: "icons.2",
  },
];

const Header: ServerComponent = () => {
  const t = useTranslations("home.Header");

  const subtitle = t.rich("subtitle", {
    strong: (chunks) => <strong>{chunks}</strong>,
  });

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
      <Container sx={{ paddingY: 2 }}>
        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            gap: 8,
            marginTop: 2,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Image src={istexDlLogo} alt="Istex-DL" />
            <Typography
              color="white"
              variant="subtitle1"
              sx={{ fontSize: "0.875rem", lineHeight: 1.25 }}
            >
              {subtitle}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, md: 0 } }}>
            {icons.map((icon) => {
              const title = t(icon.title);
              return (
                <Avatar
                  key={title}
                  title={title}
                  sx={{
                    m: "auto",
                    bgcolor: "colors.white",
                    color: "colors.lightBlack",
                  }}
                >
                  <icon.component />
                </Avatar>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
