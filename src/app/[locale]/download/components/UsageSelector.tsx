"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Tab, Tabs } from "@/mui/material";
import { usages, type Usage } from "@/config";
import type { ClientComponent } from "@/types/next";

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
    <Tabs value={currentUsage} onChange={handleChange} centered>
      {usages.map(({ name, label }) => (
        <Tab key={name} value={name} label={t(label)} />
      ))}
    </Tabs>
  );
};

export default UsageSelector;
