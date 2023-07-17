"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next-intl/client";
import { montserrat } from "@/mui/fonts";
import { Tab, Tabs } from "@/mui/material";
import { styled } from "@mui/material/styles";
import { type UsageName, usages } from "@/config";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const UsageSelector: ClientComponent = () => {
  const t = useTranslations("config.usages");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentUsageName, setCurrentUsageName] = useState<UsageName>(
    searchParams.getUsageName()
  );

  const handleChange = (_: React.SyntheticEvent, newValue: UsageName) => {
    setCurrentUsageName(newValue);
    searchParams.setUsageName(newValue);

    const formatToSelect = usages[newValue].formats;
    searchParams.setFormats(formatToSelect);

    router.replace(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <StyledTabs value={currentUsageName} onChange={handleChange} centered>
      {Object.keys(usages).map((name) => (
        <StyledTab
          key={name}
          value={name}
          label={t(`${name}.label`)}
          disableTouchRipple
        />
      ))}
    </StyledTabs>
  );
};

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

export default UsageSelector;
