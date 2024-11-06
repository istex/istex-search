"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import navbarLinks from "./navbarLinks";

export default function Navbar() {
  const t = useTranslations("home.Navbar");
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu: React.MouseEventHandler<HTMLElement> = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="sticky" component="nav" sx={{ bgcolor: "colors.white" }}>
      <Container sx={{ display: "flex", fontSize: "0.625rem" }}>
        {/* Burger menu that only appears on small screens */}
        <Box sx={{ display: { xs: "flex", sm: "none" } }}>
          <IconButton
            size="small"
            aria-label="external scientific documentation resources"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", sm: "none" },
            }}
          >
            {navbarLinks.others.map(({ label, url }) => (
              <MenuItem key={label} onClick={handleCloseNavMenu}>
                <Typography
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  sx={{ color: "text.primary", textDecoration: "none" }}
                >
                  {t(label)}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Istex website button */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "inherit",
            justifyContent: { xs: "center", sm: "start" },
          }}
        >
          <Button
            href={navbarLinks.istex.url}
            target="_blank"
            rel="noreferrer"
            sx={(theme) => ({
              gap: 1,
              color: "text.primary",
              bgcolor: alpha(theme.palette.colors.blue, 0.2),
              borderRadius: 0,
              textDecoration: "none",
              fontSize: "0.625rem",
              textTransform: "uppercase",
            })}
          >
            <KeyboardBackspaceIcon />
            {t(navbarLinks.istex.label)}
          </Button>
        </Box>

        {/* External resources that only appear on medium and large screens */}
        <Box
          component="ul"
          sx={{
            flexGrow: 1,
            gap: "1px",
            justifyContent: "flex-end",
            display: { xs: "none", sm: "flex" },
          }}
        >
          {navbarLinks.others.map(({ label, url }) => (
            <li key={label}>
              <Button
                onClick={handleCloseNavMenu}
                href={url}
                target="_blank"
                rel="noreferrer"
                sx={{
                  height: "100%",
                  bgcolor: "white",
                  borderRadius: 0,
                  color: "text.primary",
                  fontSize: "0.625rem",
                }}
              >
                {t(label)}
              </Button>
            </li>
          ))}
        </Box>
      </Container>
    </AppBar>
  );
}
