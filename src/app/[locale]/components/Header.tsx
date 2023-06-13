import Image from "next/image";
import { useTranslations } from "next-intl";
import { Avatar, Box, Container, Typography } from "@/mui/material";
import { DownloadIcon } from "@/mui/icons-material";
import istexDlLogo from "@/../public/istex-dl.svg";
import type { ServerComponent } from "@/types/next";

import styles from "./Header.module.scss";

const icons = [
  {
    component: DownloadIcon,
    title: "Header.icons.0",
  },
  {
    component: DownloadIcon,
    title: "Header.icons.1",
  },
  {
    component: DownloadIcon,
    title: "Header.icons.2",
  },
];

const Header: ServerComponent = () => {
  const t = useTranslations();

  const subtitle = t.rich("Header.subtitle", {
    strong: (chunks) => <strong>{chunks}</strong>,
  });

  return (
    <header className={styles.header}>
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
                    color: "colors.black.light",
                  }}
                >
                  <icon.component />
                </Avatar>
              );
            })}
          </Box>
        </Box>
      </Container>
    </header>
  );
};

export default Header;
