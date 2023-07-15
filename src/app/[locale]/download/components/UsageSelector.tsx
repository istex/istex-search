"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next-intl/client";
import { useSearchParams } from "next/navigation";
import { montserrat } from "@/mui/fonts";
import { Tab, Tabs } from "@/mui/material";
import { styled } from "@mui/material/styles";
import { type Usage, usages, NO_FORMAT_SELECTED } from "@/config";
import type { ClientComponent } from "@/types/next";

const UsageSelector: ClientComponent = () => {
  const t = useTranslations("config.usages");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentUsage, setCurrentUsage] = useState<Usage["name"]>(
    (searchParams.get("usage") as Usage["name"]) ?? usages[0].name
  );

  const handleChange = (_: React.SyntheticEvent, newValue: Usage["name"]) => {
    setCurrentUsage(newValue);

    const searchParamsCopy = new URLSearchParams(searchParams.toString());
    searchParamsCopy.set("usage", newValue);

    const formatToSelect = usages.find(
      ({ name }) => name === newValue
    )?.formats;
    if (formatToSelect != null) {
      if (formatToSelect === NO_FORMAT_SELECTED) {
        searchParamsCopy.delete("formats");
      } else {
        searchParamsCopy.set("formats", formatToSelect.toString());
      }
    }

    router.replace(`${pathname}?${searchParamsCopy.toString()}`);
  };

  return (
    <StyledTabs value={currentUsage} onChange={handleChange} centered>
      {usages.map(({ name }) => (
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
