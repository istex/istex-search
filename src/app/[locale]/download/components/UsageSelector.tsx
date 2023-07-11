"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { montserrat } from "@/mui/fonts";
import { Tab, Tabs } from "@/mui/material";
import { styled } from "@mui/material/styles";
import { usages, type Usage } from "@/config";
import type { ClientComponent } from "@/types/next";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "&.MuiTabs-root": {
    borderRadius: 999,
    backgroundColor: theme.palette.colors.white,
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

const UsageSelector: ClientComponent = () => {
  const t = useTranslations("config.usages");
  const [currentUsage, setCurrentUsage] = useState<Usage["name"]>(
    usages[0].name
  );

  const handleChange = (
    _: React.SyntheticEvent,
    newValue: Usage["name"]
  ): void => {
    setCurrentUsage(newValue);
  };

  return (
    <StyledTabs value={currentUsage} onChange={handleChange} centered>
      {usages.map(({ name, label }) => (
        <StyledTab
          key={name}
          value={name}
          label={t(label)}
          disableTouchRipple
        />
      ))}
    </StyledTabs>
  );
};

export default UsageSelector;
