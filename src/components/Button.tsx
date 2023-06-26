"use client";

import { Button as MuiButton } from "@/mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import type { Palette } from "@mui/material/styles";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import type { HTMLAttributeAnchorTarget } from "react";
import type { ClientComponent } from "@/types/next";
import type { KeyOf } from "@/types/utility";

type ButtonProps = Omit<MuiButtonProps, "sx"> & {
  mainColor: KeyOf<Palette["colors"]>;
  secondaryColor: KeyOf<Palette["colors"]>;
  target?: HTMLAttributeAnchorTarget;
};

const Button: ClientComponent<ButtonProps> = (props) => {
  const theme = useTheme();
  const { mainColor, secondaryColor, ...rest } = props;
  let { variant } = props;

  // Change the default value of 'variant' from 'text' to 'contained'
  if (variant == null) {
    variant = "contained";
  }

  // Custom palette colors are under theme.palette.colors
  const actualMainColor = `colors.${mainColor}`;
  const actualSecondaryColor = `colors.${secondaryColor}`;

  let sxProp: MuiButtonProps["sx"];
  if (variant === "outlined") {
    sxProp = {
      borderColor: actualMainColor,
      color: actualMainColor,
      "&:hover": {
        bgcolor: actualMainColor,
        color: actualSecondaryColor,
      },
    };
  } else {
    sxProp = {
      bgcolor: actualMainColor,
      color: actualSecondaryColor,
      "&:hover": {
        background: `linear-gradient(to left, ${lighten(
          theme.palette.colors[mainColor],
          0.15
        )}, ${theme.palette.colors[mainColor]})`,
        bgcolor: actualMainColor,
      },
    };
  }

  return <MuiButton variant={variant} sx={sxProp} {...rest} />;
};

export default Button;
