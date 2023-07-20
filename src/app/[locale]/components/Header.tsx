import { useTranslations } from "next-intl";
import Image from "next/image";
import DownloadIcon from "@mui/icons-material/Download";
import { Avatar, Box, Container, Typography } from "@mui/material";
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
      <Container sx={{ py: 2 }}>
        <Box
          sx={{
            display: { xs: "block", sm: "flex" },
            gap: 8,
            mt: 2,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Image src={istexDlLogo} alt="Istex-DL" />
            <Typography
              color="white"
              variant="subtitle1"
              sx={{
                fontSize: "0.875rem",
                fontWeight: "bold",
                lineHeight: 1.25,
              }}
            >
              {t("subtitle")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, sm: 0 } }}>
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
