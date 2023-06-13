"use client";

import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@/mui/material";
import { KeyboardBackspaceIcon, MenuIcon } from "@/mui/icons-material";
import { alpha } from "@mui/material/styles";
import type { NavbarLinks } from "./NavbarLinks";
import type { ClientComponent } from "@/types/next";

interface NavbarProps {
  links: NavbarLinks;
}

const Navbar: ClientComponent<NavbarProps> = ({ links }) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (): void => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      component="nav"
      sx={{ position: "sticky", bgcolor: "colors.white" }}
    >
      <Container sx={{ display: "flex", fontSize: "0.625rem" }}>
        {/* Burger menu that only appears on small screens */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
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
              display: { xs: "block", md: "none" },
            }}
          >
            {links.others.map(({ label, url }) => (
              <MenuItem key={label} onClick={handleCloseNavMenu}>
                <Typography
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  sx={{ color: "text.primary", textDecoration: "none" }}
                >
                  {label}
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
            justifyContent: { xs: "center", md: "start" },
          }}
        >
          <Button
            component="a"
            href={links.istex.url}
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
            {links.istex.label}
          </Button>
        </Box>

        {/* External resources that only appear on medium and large screens */}
        <Box
          sx={{
            flexGrow: 1,
            gap: "1px",
            justifyContent: "flex-end",
            display: { xs: "none", md: "flex" },
          }}
        >
          {links.others.map(({ label, url }) => (
            <Button
              key={label}
              onClick={handleCloseNavMenu}
              component="a"
              href={url}
              target="_blank"
              rel="noreferrer"
              sx={{
                bgcolor: "white",
                borderRadius: 0,
                color: "text.primary",
                fontSize: "0.625rem",
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Container>
    </AppBar>
  );
};

export default Navbar;
