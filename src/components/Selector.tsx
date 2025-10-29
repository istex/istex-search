"use client";

import { Box, Tab, Tabs, type TabsProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { montserrat } from "@/mui/fonts";

interface SelectorProps extends TabsProps {
  options: readonly string[];
  t: (key: string) => string;
  disabled?: boolean;
  value?: unknown; // Base type is any so we set to unknown so that eslint doesn't complain
}

export default function Selector(props: SelectorProps) {
  const { value, onChange, options, t, disabled, ...rest } = props;

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <StyledTabs
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        value={value}
        onChange={onChange}
        aria-disabled={disabled}
        {...rest}
      >
        {options.map((name) => (
          <StyledTab
            key={name}
            value={name}
            label={t(name)}
            disableTouchRipple
            disabled={disabled}
          />
        ))}
      </StyledTabs>
    </Box>
  );
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "&.MuiTabs-root": {
    borderRadius: 999,
    backgroundColor: theme.vars.palette.colors.white,
    padding: theme.spacing(1),
    minHeight: "fit-content",
  },
  "& .MuiTabs-flexContainer": {
    height: "100%",
  },
  "& .MuiTabs-indicator": {
    top: 3,
    bottom: 3,
    right: 3,
    height: "auto",
    background: "none",
    "&:after": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      left: 4,
      right: 4,
      bottom: 0,
      borderRadius: 999,
      backgroundColor: "white",
      boxShadow: "0 4px 5px 0 rgba(0, 0, 0, 0.1)",
    },
  },
  "& .MuiTabs-scrollButtons": {
    width: "unset",
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  "&.MuiTab-root": {
    fontFamily: montserrat.style.fontFamily,
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    minHeight: "fit-content",
    borderRadius: 999,
    zIndex: 1,
  },
}));
