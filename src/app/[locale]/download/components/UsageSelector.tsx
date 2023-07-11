"use client";

import { useState } from "react";
import { Tab, Tabs } from "@/mui/material";
import { usages, type Usage } from "@/config";
import type { ClientComponent } from "@/types/next";

export type UsageSelectorLabels = Record<Usage["name"], string>;

const UsageSelector: ClientComponent<{ labels: UsageSelectorLabels }> = ({
  labels,
}) => {
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
      {usages.map(({ name }) => (
        <Tab key={name} value={name} label={labels[name]} />
      ))}
    </Tabs>
  );
};

export default UsageSelector;
