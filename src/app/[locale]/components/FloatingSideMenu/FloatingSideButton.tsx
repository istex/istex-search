import type * as React from "react";
import Button from "@/components/Button";

interface FloatingSideButtonProps {
  id?: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function FloatingSideButton({
  id,
  icon,
  label,
  onClick,
}: FloatingSideButtonProps) {
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
}
