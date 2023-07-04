"use client";

import type { HTMLAttributeAnchorTarget } from "react";
import { Button as MuiButton } from "@/mui/material";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { lighten, styled } from "@mui/material/styles";
import type { Palette } from "@mui/material/styles";
import type { ClientComponent } from "@/types/next";
import type { KeyOf } from "@/types/utility";

interface CustomButtonProps extends MuiButtonProps {
  mainColor: KeyOf<Palette["colors"]>;
  secondaryColor: KeyOf<Palette["colors"]>;
  target?: HTMLAttributeAnchorTarget;
}

// Wrapper component to change the default value of the 'variant' prop from 'text' to 'contained'
const CustomButton: ClientComponent<CustomButtonProps> = (props) => {
  let { variant, mainColor, secondaryColor, ...rest } = props;

  if (variant == null) {
    variant = "contained";
  }

  return <MuiButton variant={variant} {...rest} />;
};

const Button = styled(CustomButton)<CustomButtonProps>(
  ({ variant, mainColor, secondaryColor, theme }) => {
    const _mainColor = theme.palette.colors[mainColor];
    const _secondaryColor = theme.palette.colors[secondaryColor];

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

    return {
      backgroundColor: _mainColor,
      color: _secondaryColor,
      "&:hover": {
        background: `linear-gradient(to left, ${lighten(
          _mainColor,
          0.15
        )}, ${_mainColor})`,
        backgroundColor: _mainColor,
      },
    };
  }
);

export default Button;
