"use client";

import * as React from "react";
import { Button as MuiButton } from "@mui/material";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { lighten, styled, type Palette } from "@mui/material/styles";
import type { KeyOf } from "@/types/utility";

interface CustomButtonProps extends MuiButtonProps {
  mainColor?: KeyOf<Palette["colors"]>;
  secondaryColor?: KeyOf<Palette["colors"]>;
  target?: React.HTMLAttributeAnchorTarget;
}

// Wrapper component to change the default value of the 'variant' prop from 'text' to 'contained'
function CustomButton(props: CustomButtonProps) {
  let { variant, mainColor, secondaryColor, ...rest } = props;

  if (variant == null) {
    variant = "contained";
  }

  return <MuiButton variant={variant} {...rest} />;
}

const Button = styled(CustomButton)<CustomButtonProps>(({
  variant,
  mainColor,
  secondaryColor,
  theme,
}) => {
  const _mainColor = theme.palette.colors[mainColor ?? "blue"];
  const _secondaryColor = theme.palette.colors[secondaryColor ?? "white"];

  if (variant === "outlined") {
    return {
      borderColor: _mainColor,
      color: _mainColor,
      "&:hover": {
        backgroundColor: _mainColor,
        borderColor: _mainColor,
        color: _secondaryColor,
      },
    };
  }

  if (variant === "text") {
    return {
      color: _mainColor,
      "&:hover": {
        backgroundColor: lighten(_mainColor, 0.85),
      },
    };
  }

  return {
    backgroundColor: _mainColor,
    color: _secondaryColor,
    boxShadow: "none",
    "&:hover": {
      background: `linear-gradient(to left, ${lighten(
        _mainColor,
        0.15,
      )}, ${_mainColor})`,
      backgroundColor: _mainColor,
      boxShadow: "none",
    },
  };
});

export default Button;
