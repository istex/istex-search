"use client";

import * as React from "react";
import Button from "@/components/Button";
import type { ClientComponent } from "@/types/next";

interface FloatingSideButtonProps {
  id?: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const FloatingSideButton: ClientComponent<FloatingSideButtonProps> = ({
  id,
  icon,
  label,
  onClick,
}) => {
  return (
    <Button
      id={id}
      size="small"
      startIcon={icon}
      sx={{
        color: "white",
        transition: "transform 1s",
        textTransform: "none",
        transform: "translatex(calc(100% - 30px))",
        "&:hover": {
          transform: "translatex(0)",
        },
        pointerEvents: "auto",
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default FloatingSideButton;
